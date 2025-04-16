"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // 직접 three에서 가져옴
import { GLTFLoader, OrbitControls } from "three-stdlib"; // 이전에 사용 중이던 로더 유지
import { AiFillPicture } from "react-icons/ai";
import {
  FiUpload,
  FiRefreshCw,
  FiShare2,
  FiRotateCw,
  FiX,
  FiSave,
} from "react-icons/fi";
import { MdError } from "react-icons/md";
import ResultModal from "./AiModel/ResultModal"; // 올바른 경로로 수정
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import useUser from "@/app/hooks/useUser";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

const SERVER_URL = "realserver.metabank360.com:5100";

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_LOCAL_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY!,
  },
});

// S3 업로드 함수
const uploadFileToS3 = async (
  file: Blob,
  fileName: string,
  contentType: string,
  onProgress: (progress: number) => void,
  acl?: ObjectCannedACL
): Promise<string> => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: fileName,
      Body: file,
      ContentType: contentType,
      ACL: acl,
    },
    queueSize: 4,
    partSize: 5 * 1024 * 1024, // 5MB
    leavePartsOnError: false,
  });

  upload.on("httpUploadProgress", (progress) => {
    if (progress.total) {
      const percentage = (progress.loaded! / progress.total) * 100;
      onProgress(percentage);
    }
  });

  await upload.done();
  return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`;
};

export default function PhotogrammetryViewer() {
  const { data: userData } = useUser();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [clientId] = useState(`user_${Date.now()}`);
  const [connectionInfo, setConnectionInfo] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [wsConnected, setWsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [s3ModelUrl, setS3ModelUrl] = useState<string | null>(null); // S3에 저장된 모델 URL
  const [s3UploadProgress, setS3UploadProgress] = useState<number>(0);
  const [s3Uploading, setS3Uploading] = useState<boolean>(false);
  const [modelTitle, setModelTitle] = useState<string>("");
  const viewerRef = useRef<HTMLDivElement>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelBlobRef = useRef<Blob | null>(null); // 모델 블롭 참조 저장

  // WebSocket 연결 설정
  useEffect(() => {
    // 컴포넌트 언마운트 시 WebSocket 연결 정리
    return () => {
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        console.log("🔌 컴포넌트 언마운트: WebSocket 연결 종료");
        socket.close();
      }
    };
  }, [socket]);

  // WebSocket 연결 초기화 함수
  const initWebSocket = async (): Promise<{
    connected: boolean;
    connectionInfo?: string;
  }> => {
    // 이미 연결된 경우 먼저 정리
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      socket.close();
    }

    // 커넥션 정보 초기화
    setConnectionInfo(null);

    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return { connected: false };

    console.log("🔌 WebSocket 연결 시도:", `wss://${SERVER_URL}/ws`);
    setError(null);

    try {
      return new Promise((resolve) => {
        let connInfo: string | undefined = undefined;
        const ws = new WebSocket(`wss://${SERVER_URL}/ws`);

        // 연결 타임아웃 (5초)
        const connectionTimeoutId = setTimeout(() => {
          console.log("⏱️ WebSocket 연결 타임아웃");
          ws.close();
          setWsConnected(false);
          setError("서버 연결 타임아웃. 다시 시도해주세요.");
          resolve({ connected: false });
        }, 5000);

        // 연결 정보 타임아웃 (5초)
        let infoTimeoutId: NodeJS.Timeout | null = null;

        ws.onopen = () => {
          console.log("✅ WebSocket 연결됨");
          clearTimeout(connectionTimeoutId);
          setWsConnected(true);
          setError(null);

          try {
            // 연결 메시지 보내기
            ws.send(JSON.stringify({ type: "connect" }));
            setSocket(ws);

            // 연결 정보 타임아웃 설정
            infoTimeoutId = setTimeout(() => {
              console.log("⏱️ 연결 정보 수신 타임아웃");
              resolve({ connected: true, connectionInfo: connInfo });
            }, 5000);
          } catch (err) {
            console.error("메시지 전송 오류:", err);
            setError("서버 연결이 불안정합니다. 다시 시도해주세요.");
            ws.close();
            resolve({ connected: false });
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("수신된 메시지:", message);

            if (
              message.type === "connect" &&
              message.status === "ok" &&
              message.connection_info
            ) {
              console.log("🔑 연결 정보 수신:", message.connection_info);

              // 상태와 로컬 변수 모두 업데이트
              connInfo = message.connection_info;
              setConnectionInfo(message.connection_info);

              // 연결 정보 타임아웃 취소
              if (infoTimeoutId) {
                clearTimeout(infoTimeoutId);
                infoTimeoutId = null;
              }

              // 즉시 리졸브
              resolve({
                connected: true,
                connectionInfo: message.connection_info,
              });
            } else if (message.type === "progress" && message.value) {
              setProgress(message.value);
            }
          } catch (error) {
            console.error("WebSocket 메시지 처리 오류:", error);
            setError("메시지 처리 중 오류가 발생했습니다.");
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket 오류:", error);
          setWsConnected(false);
          setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
          clearTimeout(connectionTimeoutId);
          if (infoTimeoutId) clearTimeout(infoTimeoutId);
          resolve({ connected: false });
        };

        ws.onclose = () => {
          console.log("🔌 WebSocket 연결 종료");
          setWsConnected(false);
          clearTimeout(connectionTimeoutId);
          if (infoTimeoutId) clearTimeout(infoTimeoutId);
        };
      });
    } catch (err) {
      console.error("🔌 WebSocket 초기화 오류:", err);
      setError("서버 연결 초기화에 실패했습니다.");
      setWsConnected(false);
      return { connected: false };
    }
  };

  // WebSocket 연결 종료 함수
  const closeWebSocket = () => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("🔌 WebSocket 연결 종료");
      socket.close();
      setSocket(null);
      setWsConnected(false);
    }
  };

  // 파일 선택 핸들러
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      // 파일 확장자 검사
      const fileType = file.type.toLowerCase();
      if (!fileType.includes("image/")) {
        setError("이미지 파일만 업로드 가능합니다");
        return;
      }

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다");
        return;
      }

      setError(null);
      // 불필요한 sRGB 변환 제거, 이미지 파일 직접 설정
      setImageFile(file);
      setLoading(false); // UI 튐 방지
    }
  };

  // 버튼 클릭 시 프로세스 시작
  const handleGenerateClick = async () => {
    // 이미 로딩 중이면 무시
    if (loading) return;

    // 진행 중인 모든 처리 초기화
    if (modelGenerated) {
      resetProcess();
      // 이미지가 없는 경우 여기서 종료
      if (!imageFile) return;
    }

    if (!imageFile) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setError(null);
    setLoading(true);
    // 진행률 완전 초기화
    setProgress(0);

    // WebSocket 연결 시도 및 연결 정보 가져오기
    const result = await initWebSocket();

    if (!result.connected) {
      setLoading(false);
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!result.connectionInfo) {
      setLoading(false);
      setError("서버 연결 정보를 가져오지 못했습니다. 다시 시도해주세요.");
      closeWebSocket();
      return;
    }

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("image_file", imageFile!);
    formData.append("connection_info", result.connectionInfo);

    // 큐 상태 확인
    await checkQueueStatus(formData);
  };

  // 모델 생성 요청
  const generateModel = async (formData: FormData) => {
    const connectionInfoValue = formData.get("connection_info") as string;
    const imageFileValue = formData.get("image_file") as File;

    if (!imageFileValue || !connectionInfoValue) {
      setError("이미지 파일 또는 연결 정보가 누락되었습니다.");
      console.error(
        "FormData에서 이미지 파일 또는 connection_info를 찾을 수 없음"
      );
      closeWebSocket();
      return;
    }

    setLoading(true);
    setProgress(40); // 40%부터 시작

    // 예상 처리 시간을 30초로 단축 (실제 생성 시간이 빠른 경우)
    const estimatedProcessingTime = 30000; // 30초
    const progressUpdateInterval = 50; // 50ms마다 업데이트 (더 부드러운 진행을 위해)
    const progressStep =
      (90 - 40) / (estimatedProcessingTime / progressUpdateInterval); // 40%에서 90%까지 계속 진행

    // 로딩 바 진행을 위한 인터벌 설정 - 누적 방식으로 구현
    let currentProgress = 40;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        // 진행 속도를 조정 (더 빠르게 상승하도록)
        const speedFactor = 1.5 - (currentProgress - 40) / 100; // 가속 계수 증가, 속도 감소 완화
        const increment = progressStep * speedFactor;

        currentProgress += increment;
        setProgress(Math.min(90, Math.floor(currentProgress)));
      }
    }, progressUpdateInterval);

    try {
      const response = await fetch(`https://${SERVER_URL}/generate`, {
        method: "POST",
        body: formData,
      });

      // 이제 서버 응답이 왔을 때 인터벌 정리하지 않고 계속 진행
      if (!response.ok) {
        clearInterval(progressInterval); // 오류 시에만 인터벌 정리
        throw new Error(`상태 코드: ${response.status}`);
      }

      const result = await response.json();

      if (result.model_url || result.glb_url) {
        const url = result.model_url || result.glb_url;
        setModelUrl(url);

        // 서버 응답 시 진행률 가속
        currentProgress = Math.max(currentProgress, 75); // 최소 75%로 설정
        setProgress(Math.floor(currentProgress));

        // 인터벌은 계속 유지하여 진행률이 자연스럽게 상승하도록 함
      } else {
        clearInterval(progressInterval);
        setError(
          "모델 생성에 실패했습니다: " + (result.error || "알 수 없는 오류")
        );
        closeWebSocket();
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("모델 생성 오류:", error);
      setError("모델 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      closeWebSocket();
    } finally {
      // 모델이 로드될 때까지 로딩 상태 유지
      if (!modelUrl) {
        setLoading(false);
      }
    }
  };

  // 큐 상태 확인
  const checkQueueStatus = async (formData: FormData) => {
    const connectionInfoValue = formData.get("connection_info") as string;

    if (!connectionInfoValue) {
      setError("연결 정보가 없습니다. 다시 시도해주세요.");
      closeWebSocket();
      return;
    }

    try {
      setProgress(5); // 초기 진행률 표시

      // 큐 상태 확인 중 진행률 서서히 증가 - 더 빠르게
      let currentProgress = 5;
      const progressInterval = setInterval(() => {
        if (currentProgress < 30) {
          currentProgress += 1; // 0.5에서 1로 증가
          setProgress(Math.floor(currentProgress));
        }
      }, 100); // 더 빠른 업데이트

      const response = await fetch(
        `https://${SERVER_URL}/queue_status?connection_info=${encodeURIComponent(
          connectionInfoValue
        )}`,
        { method: "GET" }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "waiting") {
        setQueuePosition(result.position);

        // 대기 위치에 따라 진행률 설정 (30-38% 범위)
        const progressValue = Math.floor(
          Math.max(30, Math.min(38, 38 - result.position))
        );
        setProgress(progressValue);

        // 다음 큐 확인 직전까지 진행률 서서히 증가 - 더 빠르게
        let waitProgress = progressValue;
        const waitInterval = setInterval(() => {
          waitProgress += 0.5; // 0.2에서 0.5로 증가
          if (waitProgress < progressValue + 5) {
            // 3에서 5로 증가
            setProgress(Math.floor(waitProgress));
          } else {
            clearInterval(waitInterval);
          }
        }, 100); // 더 빠른 업데이트

        const interval = 1000 + result.position * 200;
        pollingTimeoutRef.current = setTimeout(() => {
          clearInterval(waitInterval);
          checkQueueStatus(formData);
        }, interval);
      } else if (result.status === "ready") {
        setQueuePosition(null);

        // 대기열 완료 후 40% 진행률로 빠르게 전환
        let transitionProgress = Math.floor(currentProgress);
        const transitionInterval = setInterval(() => {
          if (transitionProgress < 40) {
            transitionProgress += 2; // 1에서 2로 증가 (더 빠르게)
            setProgress(transitionProgress);
          } else {
            clearInterval(transitionInterval);
            // 모델 생성 시작
            generateModel(formData);
          }
        }, 50); // 더 빠른 업데이트
      } else {
        console.error("예상치 못한 큐 상태:", result.status);
        setError("큐 처리 중 오류가 발생했습니다.");
        closeWebSocket();
      }
    } catch (error) {
      console.error("큐 상태 확인 오류:", error);
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      closeWebSocket();
    }
  };

  // 모델 URL -> Blob URL 변환
  useEffect(() => {
    if (modelUrl) {
      // 모델 URL을 받았으므로 진행률 90% 이상으로 설정
      setProgress(92);

      // 소켓 연결 종료
      closeWebSocket();

      fetch(modelUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`상태 코드: ${res.status}`);
          }
          return res.blob();
        })
        .then((blob) => {
          if (blobUrl) URL.revokeObjectURL(blobUrl);

          // 모델 로드 완료 후 진행률 100%로 빠르게 증가
          let finalProgress = 92;
          const finalProgressInterval = setInterval(() => {
            finalProgress += 1; // 0.5에서 1로 증가 (더 빠르게)
            if (finalProgress < 100) {
              setProgress(Math.floor(finalProgress));
            } else {
              clearInterval(finalProgressInterval);
              setProgress(100);

              // 모델이 로드되면 Blob URL 생성
              const newBlobUrl = URL.createObjectURL(blob);
              setBlobUrl(newBlobUrl);

              // 모델이 성공적으로 생성됨
              setModelGenerated(true);

              // 이미지 파일명을 기반으로 모델 타이틀 생성
              if (imageFile) {
                const fileName = imageFile.name.split(".")[0];
                setModelTitle(`AI_3D_${fileName}_${Date.now()}`);
              } else {
                setModelTitle(`AI_3D_Model_${Date.now()}`);
              }

              // 모델 Blob 저장 (나중에 S3에 업로드하기 위해)
              modelBlobRef.current = blob;

              // 진행률이 100%에 도달하면 모달 표시
              setTimeout(() => {
                setShowModal(true);
                setLoading(false);
              }, 300); // 500ms에서 300ms로 단축
            }
          }, 50); // 100ms에서 50ms로 더 빠른 업데이트
        })
        .catch((err) => {
          console.error("❌ Blob 변환 오류:", err);
          setError("3D 모델을 불러오는데 실패했습니다.");
          setLoading(false);
        });
    }
  }, [modelUrl, imageFile]);

  // S3에 모델 저장 함수
  const saveModelToS3 = async () => {
    // 사용자 인증 확인
    if (!userData?.getMyInfo?.id) {
      setError("모델을 저장하려면 로그인이 필요합니다.");
      return;
    }

    if (!modelBlobRef.current) {
      setError("저장할 모델이 없습니다.");
      return;
    }

    try {
      setS3Uploading(true);
      setS3UploadProgress(0);

      const userId = userData.getMyInfo.id;
      const fileName = `AI_3D_Models/${userId}/${modelTitle}.glb`;

      // S3에 모델 업로드 (public-read 권한으로 저장)
      const url = await uploadFileToS3(
        modelBlobRef.current,
        fileName,
        "model/gltf-binary",
        (progress) => setS3UploadProgress(progress),
        "public-read" as ObjectCannedACL
      );

      setS3ModelUrl(url);
      setS3UploadProgress(100);
      console.log("✅ 모델이 S3에 저장됨:", url);

      // 저장 성공 메시지 표시
      alert(
        "3D 모델이 내 계정에 저장되었습니다. '나의 자산' 탭에서 확인할 수 있습니다."
      );
    } catch (error) {
      console.error("❌ S3 업로드 오류:", error);
      setError("모델 저장 중 오류가 발생했습니다.");
    } finally {
      setS3Uploading(false);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    console.log("🖼️ 모달 닫기");
    setShowModal(false);
  };

  // 프로세스 리셋
  const resetProcess = () => {
    console.log("🔄 프로세스 초기화");

    // 진행 중인 인터벌 및 타임아웃 정리
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    // 모든 진행 중인 타이머 정리 (TypeScript 타입 오류 수정)
    const highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 1; i < highestTimeoutId; i++) {
      window.clearTimeout(i);
    }

    // WebSocket 연결 종료
    closeWebSocket();

    // 상태 완전 초기화
    setImageFile(null);
    setLoading(false);
    setModelUrl(null);

    // Blob URL 정리
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    // 기타 상태 초기화
    setError(null);
    setProgress(0);
    setQueuePosition(null);
    setShowModal(false);
    setModelGenerated(false);

    // 페이지 스크롤 맨 위로 이동 (선택 사항)
    window.scrollTo(0, 0);
  };

  // ResultModal 컴포넌트에 전달할 추가 props 정의
  const modelProps = {
    blobUrl: blobUrl!,
    onClose: handleCloseModal,
    onReset: resetProcess,
    onSave: saveModelToS3,
    s3Uploading,
    s3UploadProgress,
    modelTitle,
    onTitleChange: (newTitle: string) => setModelTitle(newTitle),
  };

  // 모델 보기 핸들러 - 이미 생성된 모델을 다시 볼 때 사용
  const handleViewModel = () => {
    console.log("🖼️ 모델 보기");
    setShowModal(true);
  };

  // 디버깅용 - 모든 상태 로그 (제거)
  useEffect(() => {
    // 상세 로그 삭제
  }, [
    wsConnected,
    connectionInfo,
    imageFile,
    loading,
    modelUrl,
    blobUrl,
    error,
    progress,
    showModal,
  ]);

  // polling 정리
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    };
  }, []);

  // 브라우저 창 닫히거나 탭 전환 시 소켓 연결 종료
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 페이지 벗어날 때 소켓 연결 종료
    const handleBeforeUnload = () => {
      closeWebSocket();
    };

    // 브라우저 탭이 비활성화될 때 소켓 연결 종료
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        closeWebSocket();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 처리 시간 초과 시 소켓 연결 종료
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    // 처리 중일 때만 타임아웃 설정 (3분)
    if (loading && wsConnected) {
      timeoutId = setTimeout(() => {
        console.log("⏱️ 처리 시간 초과 (3분)");
        setError("처리 시간이 초과되었습니다. 다시 시도해주세요.");
        closeWebSocket();
        setLoading(false);
      }, 3 * 60 * 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, wsConnected]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {/* 상태 표시 바 */}
      {(loading || error) && (
        <div className="w-full rounded-lg overflow-hidden bg-gray-200">
          {loading && !error && (
            <>
              <div
                className={`h-2 bg-blue-500 progress-bar-${Math.floor(
                  progress
                )}`}
                style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
              ></div>
              <div className="text-center text-sm text-gray-700 py-1">
                {queuePosition !== null
                  ? `대기 중: ${queuePosition}개의 요청 앞에 있습니다`
                  : progress < 100
                  ? `모델 생성 중... ${Math.floor(progress)}%`
                  : "완료됨!"}
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 flex items-center">
              <MdError className="text-red-500 mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {!imageFile ? (
        <div className="p-6 rounded-xl bg-[rgba(0,0,0,0.3)] shadow-lg flex flex-col gap-4 w-full max-w-md border border-gray-700 h-full max-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">
              AI 3D 모델 생성
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              사진 한 장으로 3D 모델을 만들어보세요
            </p>
          </div>

          <label className="border-2 border-dashed border-blue-300 rounded-lg text-gray-300 cursor-pointer hover:text-blue-300 hover:border-blue-500 bg-[rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-8 transition-all duration-200 ">
            <FiUpload className="text-4xl text-blue-400 mb-3" />
            <span className="font-medium">이미지 업로드</span>
            <span className="text-xs text-gray-500 mt-1">
              JPG, PNG (10MB 이하)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                처리 중...
              </>
            ) : (
              <>AI 3D 모델 생성</>
            )}
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-white shadow-lg flex flex-col gap-2 w-full max-w-md border border-gray-200">
          <div className="flex gap-4 items-center mb-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                {imageFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={resetProcess}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                이미지 변경
              </button>
            </div>
          </div>

          <button
            onClick={modelGenerated ? handleViewModel : handleGenerateClick}
            disabled={loading || !imageFile}
            className={`px-4 py-2 ${
              modelGenerated
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-lg transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                처리 중...
              </>
            ) : modelGenerated ? (
              <>3D 모델 보기</>
            ) : (
              <>AI 3D 모델 생성</>
            )}
          </button>

          {modelGenerated && (
            <button
              onClick={handleGenerateClick}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FiRefreshCw size={18} />새 모델 생성하기
            </button>
          )}
        </div>
      )}

      {/* 결과 모달 (수정됨) */}
      {showModal && blobUrl && <ResultModal {...modelProps} />}
    </div>
  );
}

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
  onProgress: (progress: number) => void
): Promise<string> => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: fileName,
      Body: file,
      ContentType: contentType,
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
      // sRGB 변환 처리를 위해 파일을 직접 설정하지 않고 변환 함수 호출
      convertToSRGB(file);
    }
  };

  // 이미지를 sRGB 색상 공간으로 변환하는 함수
  const convertToSRGB = (file: File) => {
    setLoading(true);
    setProgress(5);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 캔버스 생성
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { colorSpace: "srgb" });

        if (!ctx) {
          console.error("Canvas 2D 컨텍스트를 생성할 수 없습니다.");
          setImageFile(file); // 변환 실패 시 원본 파일 사용
          setLoading(false);
          return;
        }

        // 이미지 크기에 맞게 캔버스 설정
        canvas.width = img.width;
        canvas.height = img.height;

        // 캔버스에 이미지 그리기 (sRGB 색상 공간에서)
        ctx.drawImage(img, 0, 0);

        // 이미지 데이터 가져오기
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 이미지 밝기 조정 및 감마 보정
        const brightnessIncrease = 1.3; // 밝기 증가 계수 (1보다 크면 밝아짐) - 1.2에서 1.3으로 증가
        const gammaCorrection = 1.15; // 감마 보정 (1보다 작으면 어두운 영역 밝아짐) - 1.1에서 1.15로 증가

        for (let i = 0; i < data.length; i += 4) {
          // 이미지 데이터 처리 (RGBA 형식)
          // 밝기 증가
          data[i] = Math.min(
            255,
            Math.max(0, Math.floor(data[i] * brightnessIncrease))
          ); // R
          data[i + 1] = Math.min(
            255,
            Math.max(0, Math.floor(data[i + 1] * brightnessIncrease))
          ); // G
          data[i + 2] = Math.min(
            255,
            Math.max(0, Math.floor(data[i + 2] * brightnessIncrease))
          ); // B

          // 감마 보정 (어두운 부분을 더 밝게)
          data[i] = Math.pow(data[i] / 255, 1 / gammaCorrection) * 255;
          data[i + 1] = Math.pow(data[i + 1] / 255, 1 / gammaCorrection) * 255;
          data[i + 2] = Math.pow(data[i + 2] / 255, 1 / gammaCorrection) * 255;
        }

        // 수정된 이미지 데이터를 캔버스에 적용
        ctx.putImageData(imageData, 0, 0);

        console.log("✅ 이미지 밝기 조정 및 감마 보정 완료");

        // 캔버스 데이터를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // 새 파일 생성 (원본과 같은 이름과 타입 사용)
              const convertedFile = new File([blob], file.name, {
                type: file.type,
              });
              console.log("✅ 이미지가 sRGB 색상 공간으로 변환되었습니다.");
              setImageFile(convertedFile);

              // 미리보기 URL 생성 (디버깅용)
              const previewUrl = URL.createObjectURL(blob);
              console.log("미리보기 URL 생성:", previewUrl);
            } else {
              console.error("Blob 변환 실패");
              setImageFile(file); // 변환 실패 시 원본 파일 사용
            }
            setLoading(false);
          },
          file.type,
          0.95
        ); // 95% 품질로 인코딩
      };

      img.onerror = () => {
        console.error("이미지 로딩 실패");
        setImageFile(file); // 변환 실패 시 원본 파일 사용
        setLoading(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      console.error("파일 읽기 실패");
      setImageFile(file); // 변환 실패 시 원본 파일 사용
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // 버튼 클릭 시 프로세스 시작
  const handleGenerateClick = async () => {
    if (!imageFile) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setError(null);
    setLoading(true);
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

    console.log("🚀 큐 확인 시작, 연결 정보:", result.connectionInfo);
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
    setProgress(50); // 처리 중 진행률 시작점

    // 예상 처리 시간을 약 60초로 설정 (1분)
    const estimatedProcessingTime = 60000; // 60초
    const progressUpdateInterval = 500; // 0.5초마다 업데이트
    const progressStep =
      (90 - 50) / (estimatedProcessingTime / progressUpdateInterval); // 50%에서 90%까지

    // 로딩 바 진행을 위한 인터벌 설정
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          // 소수점 제거하여 정수값만 사용
          return Math.floor(prev + progressStep);
        }
        return prev;
      });
    }, progressUpdateInterval);

    try {
      const response = await fetch(`https://${SERVER_URL}/generate`, {
        method: "POST",
        body: formData,
      });

      // 인터벌 정리
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`상태 코드: ${response.status}`);
      }

      const result = await response.json();
      setProgress(90); // 거의 완료

      if (result.model_url || result.glb_url) {
        const url = result.model_url || result.glb_url;
        setModelUrl(url);

        // 최종 10% 진행을 위한 부드러운 전환
        const finalProgressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 100) {
              return Math.min(100, prev + 1);
            } else {
              clearInterval(finalProgressInterval);
              return 100;
            }
          });
        }, 100);

        // 성공 시 소켓 연결 종료
        closeWebSocket();
      } else {
        setError(
          "모델 생성에 실패했습니다: " + (result.error || "알 수 없는 오류")
        );
        closeWebSocket();
      }
    } catch (error) {
      // 인터벌 정리
      clearInterval(progressInterval);

      console.error("모델 생성 오류:", error);
      setError("모델 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      closeWebSocket();
    } finally {
      setLoading(false);
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

      // 큐 위치가 변할 때마다 부드러운 진행률 업데이트를 위한 인터벌 설정
      let currentProgress = 5;
      const progressInterval = setInterval(() => {
        if (currentProgress < 30) {
          currentProgress += 0.5;
          // 소수점 제거하여 정수값만 사용
          setProgress(Math.floor(currentProgress));
        }
      }, 500);

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

        // 대기 위치에 따라 진행률 업데이트 (최대 30%까지만)
        const progressValue = Math.floor(
          Math.max(5, Math.min(30, 30 - result.position * 2))
        );
        setProgress(progressValue);

        const interval = 1000 + result.position * 200;
        pollingTimeoutRef.current = setTimeout(
          () => checkQueueStatus(formData),
          interval
        );
      } else if (result.status === "ready") {
        setQueuePosition(null);
        // 대기열 완료 후 40% 진행률로 부드럽게 전환
        let transitionProgress = Math.min(30, Math.floor(currentProgress));
        const transitionInterval = setInterval(() => {
          if (transitionProgress < 40) {
            transitionProgress += 1;
            setProgress(transitionProgress);
          } else {
            clearInterval(transitionInterval);
            // 모델 생성 시작
            generateModel(formData);
          }
        }, 100);
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
      console.log("🔄 모델 URL 변환 시작:", modelUrl);
      setProgress(95); // 모델 다운로드 시작

      // 소켓 연결 종료 - 모델 URL을 받았으므로 더 이상 필요 없음
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
          const newBlobUrl = URL.createObjectURL(blob);
          console.log("✅ Blob URL 생성 완료:", newBlobUrl);
          setBlobUrl(newBlobUrl);
          setProgress(100); // 완료
          setModelGenerated(true); // 모델이 성공적으로 생성됨

          // 이미지 파일명을 기반으로 모델 타이틀 생성
          if (imageFile) {
            const fileName = imageFile.name.split(".")[0];
            setModelTitle(`AI_3D_${fileName}_${Date.now()}`);
          } else {
            setModelTitle(`AI_3D_Model_${Date.now()}`);
          }

          // 모델 Blob 저장 (나중에 S3에 업로드하기 위해)
          modelBlobRef.current = blob;

          // 약간의 지연 후 모달 표시 (Blob URL이 완전히 준비되도록)
          setTimeout(() => {
            console.log("🖼️ 모달 표시");
            setShowModal(true);
          }, 500);
        })
        .catch((err) => {
          console.error("❌ Blob 변환 오류:", err);
          setError("3D 모델을 불러오는데 실패했습니다.");
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

      // S3에 모델 업로드
      const url = await uploadFileToS3(
        modelBlobRef.current,
        fileName,
        "model/gltf-binary",
        (progress) => setS3UploadProgress(progress)
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
    closeWebSocket();
    setImageFile(null);
    setLoading(false);
    setModelUrl(null);
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setError(null);
    setProgress(0);
    setQueuePosition(null);
    setShowModal(false);
    setModelGenerated(false); // 모델 생성 상태 초기화
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
                className="h-2 bg-blue-500"
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
        <div className="p-6 rounded-xl bg-white shadow-lg flex flex-col gap-6 w-full max-w-md h-full max-h-[300px] border border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              AI 3D 모델 생성
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              사진 한 장으로 3D 모델을 만들어보세요
            </p>
          </div>

          <label className="border-2 border-dashed border-blue-300 rounded-lg text-gray-500 cursor-pointer hover:text-blue-600 hover:border-blue-500 bg-blue-50 flex flex-col items-center justify-center p-8 transition-all duration-200 hover:bg-blue-100">
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
            disabled={loading}
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

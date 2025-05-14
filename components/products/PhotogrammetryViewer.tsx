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
import useUser from "@/app/hooks/useUser";
import { useQuery, useMutation } from "@apollo/client";
import { USE_CREDIT, GET_CREDIT } from "@/app/api/payment/api";
import { toast } from "react-hot-toast";

const SERVER_URL = "realserver.metabank360.com:5100";
const CREDIT_COST = 10; // 모델 생성당 필요한 크레딧

export default function PhotogrammetryViewer() {
  const { data: userData } = useUser();
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [clientId] = useState(() => {
    // 기존 clientId가 있는지 확인하고 없으면 새로 생성
    const savedClientId = localStorage.getItem("modelGenerationClientId");
    return savedClientId || `user_${Date.now()}`;
  });
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
  const [s3ModelUrl, setS3ModelUrl] = useState<string | null>(null); // 저장된 모델 URL
  const [s3UploadProgress, setS3UploadProgress] = useState<number>(0);
  const [s3Uploading, setS3Uploading] = useState<boolean>(false);
  const [modelTitle, setModelTitle] = useState<string>("");
  const viewerRef = useRef<HTMLDivElement>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelBlobRef = useRef<Blob | null>(null); // 모델 블롭 참조 저장
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태 관리
  const dropRef = useRef<HTMLLabelElement>(null); // 드롭 영역 참조

  // 페이지를 벗어날 때 확인 메시지 표시 기능
  const [isGenerating, setIsGenerating] = useState(false);

  // 크레딧 쿼리 및 뮤테이션 설정
  const { data: getCredit, refetch: refetchCredit } = useQuery(GET_CREDIT, {
    variables: { offset: 0 },
    fetchPolicy: "network-only",
  });

  const [useCredit, { loading: creditLoading }] = useMutation(USE_CREDIT);

  // 크레딧 잔액 조회
  useEffect(() => {
    if (getCredit?.getCredit) {
      const { success, balance } = getCredit.getCredit;
      if (success) {
        setCreditBalance(balance);
      }
    }
  }, [getCredit]);

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
      handleFile(file);
    }
  };

  // 파일 처리 함수 - 공통 로직 분리
  const handleFile = (file: File) => {
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
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  // 로컬 스토리지에서 생성 상태 복원
  useEffect(() => {
    // 로컬 스토리지에서 생성 상태 불러오기
    const savedGenerationState = localStorage.getItem("modelGenerationState");
    if (savedGenerationState) {
      try {
        const state = JSON.parse(savedGenerationState);
        // 생성 중인 상태였다면 복원
        if (state.loading) {
          setLoading(true);
          setProgress(state.progress || 0);
          setIsGenerating(true);

          // 모델 URL이 있는 경우 복원 (생성이 완료되었던 경우)
          if (state.modelUrl) {
            setModelUrl(state.modelUrl);
          }

          // 이미지 파일은 브라우저 제한으로 저장할 수 없으므로 다시 선택하라는 메시지 표시
          if (!state.modelUrl) {
            setError(
              "생성 중이던 모델이 있습니다. 동일한 이미지를 다시 선택해주세요."
            );
          }
        }

        // 모델 제목 복원
        if (state.modelTitle) {
          setModelTitle(state.modelTitle);
        }

        // 클라이언트 ID 저장
        localStorage.setItem("modelGenerationClientId", clientId);
      } catch (e) {
        console.error("생성 상태 복원 오류:", e);
        localStorage.removeItem("modelGenerationState");
      }
    }
  }, []);

  // 생성 상태 저장
  useEffect(() => {
    // 생성 중인 상태나 결과가 있을 때만 저장
    if (loading || modelUrl) {
      const generationState = {
        loading,
        progress,
        modelUrl,
        modelTitle,
        clientId,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "modelGenerationState",
        JSON.stringify(generationState)
      );

      // 생성 중 상태 설정
      setIsGenerating(loading);
    } else if (!loading && !modelUrl) {
      // 생성이 완전히 취소된 경우 저장된 상태 제거
      localStorage.removeItem("modelGenerationState");
      setIsGenerating(false);
    }
  }, [loading, progress, modelUrl, modelTitle, clientId]);

  // 페이지를 떠날 때 경고 메시지 표시
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGenerating) {
        const message =
          "모델 생성이 진행 중입니다. 페이지를 떠나면 생성 상태가 초기화될 수 있습니다. 계속하시겠습니까?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isGenerating]);

  // 모델 생성 요청
  const handleGenerateClick = async () => {
    if (!userData?.getMyInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (creditBalance < CREDIT_COST) {
      toast.error(
        `크레딧이 부족합니다. 현재 ${creditBalance} 크레딧, 필요 ${CREDIT_COST} 크레딧. 크레딧을 충전해주세요.`
      );
      return;
    }

    // 이미 생성 중인 경우, 확인 메시지 표시
    if (loading) {
      if (
        !window.confirm(
          "모델 생성이 이미 진행 중입니다. 새로 시작하시겠습니까?"
        )
      ) {
        return;
      }
    }

    try {
      // 모델이 이미 생성된 경우, 확인 메시지
      if (modelGenerated) {
        if (
          !window.confirm("새 모델을 생성하시겠습니까? 현재 모델은 사라집니다.")
        ) {
          return;
        }
        resetProcess();
        if (!imageFile) return;
      }

      if (!imageFile) {
        setError("이미지를 먼저 선택해주세요.");
        return;
      }

      // 크레딧 차감
      const creditResult = await useCredit({
        variables: {
          amount: CREDIT_COST,
          description: "AI 3D 모델 생성",
        },
      });

      if (!creditResult?.data?.useCredit?.success) {
        throw new Error(
          creditResult?.data?.useCredit?.message ||
            "크레딧 사용 중 오류가 발생했습니다."
        );
      }

      // 크레딧 잔액 업데이트
      setCreditBalance(creditResult.data.useCredit.remainingBalance);

      // 모델 생성 상태 설정
      setError(null);
      setLoading(true);
      setProgress(0);
      setIsGenerating(true);

      const result = await initWebSocket();

      if (!result.connected) {
        setLoading(false);
        setIsGenerating(false);
        setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      if (!result.connectionInfo) {
        setLoading(false);
        setIsGenerating(false);
        setError("서버 연결 정보를 가져오지 못했습니다. 다시 시도해주세요.");
        closeWebSocket();
        return;
      }

      const formData = new FormData();
      formData.append("client_id", clientId);
      formData.append("image_file", imageFile);
      formData.append("connection_info", result.connectionInfo);

      await checkQueueStatus(formData);
    } catch (error) {
      console.error("Error:", error);
      setIsGenerating(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "모델 생성 중 오류가 발생했습니다."
      );
    }
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

      // 생성 중 상태 해제
      setIsGenerating(false);

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
          setIsGenerating(false);
        });
    }
  }, [modelUrl, imageFile]);

  // 모델 저장 함수
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

      // 디버깅 정보 출력
      console.log("모델 파일 정보:", {
        type: modelBlobRef.current.type,
        size: modelBlobRef.current.size,
      });

      // 파일명 확장자를 명시적으로 .glb로 지정
      const fileName = `${modelTitle || "model"}.glb`;

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("modelTitle", modelTitle || `3D_Model_${Date.now()}`);

      // 필요한 경우 새 Blob 객체를 생성하여 content type 지정
      let fileToUpload = modelBlobRef.current;
      if (!fileToUpload.type || !fileToUpload.type.includes("gltf-binary")) {
        // contentType을 명시적으로 지정하여 새 Blob 생성
        fileToUpload = new Blob([modelBlobRef.current], {
          type: "model/gltf-binary",
        });
        console.log("모델 파일 타입 변환 적용됨:", fileToUpload.type);
      }

      formData.append("modelFile", fileToUpload, fileName);

      // API 엔드포인트를 통해 업로드
      console.log("업로드 시작:", fileName);

      // 진행률 표시를 위한 가상 진행 시뮬레이션
      const progressInterval = setInterval(() => {
        setS3UploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      try {
        const response = await fetch("/api/ai-models", {
          method: "POST",
          body: formData,
          // 타임아웃 설정을 위한 시그널 추가
          signal: AbortSignal.timeout(60000), // 60초 타임아웃 (큰 파일 처리를 위해 연장)
        });

        console.log("응답 상태:", response.status, response.statusText);

        // 응답 본문 텍스트 로깅 시도
        let responseText = "";
        try {
          responseText = await response.text();
          console.log("응답 원본 텍스트:", responseText);
        } catch (textError) {
          console.error("응답 텍스트 추출 오류:", textError);
        }

        // 텍스트를 JSON으로 파싱 시도
        let result;
        try {
          result = responseText ? JSON.parse(responseText) : {};
          console.log("업로드 응답 JSON:", result);
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
          throw new Error(`응답 파싱 오류: ${responseText || "응답 없음"}`);
        }

        // 진행 인터벌 정리
        clearInterval(progressInterval);

        if (!result.success) {
          throw new Error(result.error || result.details || "업로드 실패");
        }

        setS3ModelUrl(result.url);
        setS3UploadProgress(100);
        console.log("✅ 모델이 저장됨:", result.url);

        // 저장 성공 메시지 표시
        toast.success(
          "3D 모델이 내 계정에 저장되었습니다. '나의 자산' 탭에서 확인할 수 있습니다."
        );
      } catch (requestError) {
        clearInterval(progressInterval);
        console.error("요청 오류:", requestError);

        // 타임아웃 오류 여부 확인
        let errorMessage = "모델 저장 중 오류가 발생했습니다.";
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          errorMessage =
            "요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
        } else if (requestError instanceof Error) {
          errorMessage += " 세부 정보: " + requestError.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 업로드 오류:", error);
      // 메시지에 더 많은 정보 제공
      let errorMessage = "모델 저장 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        errorMessage += " 세부 정보: " + error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
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
    // 사용자에게 확인 메시지 표시
    if (
      !window.confirm("모델 생성을 초기화하고 새로운 모델을 만드시겠습니까?")
    ) {
      return; // 사용자가 취소하면 함수 종료
    }

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
    setIsGenerating(false);

    // 로컬 스토리지에서 생성 정보 제거
    localStorage.removeItem("modelGenerationState");

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

  // 모델 생성 완료 후 크레딧 잔액 새로고침
  useEffect(() => {
    if (modelGenerated) {
      refetchCredit();
    }
  }, [modelGenerated, refetchCredit]);

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
    <div className="flex flex-col items-center w-full max-w-md">
      {/* 크레딧 정보 표시 */}
      {userData?.getMyInfo && (
        <div className="w-full bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">보유 크레딧</span>
            <span className="font-semibold text-blue-600">
              {creditBalance || 0} 크레딧
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            모델 생성에는 {CREDIT_COST}크레딧이 필요합니다.
          </div>
        </div>
      )}

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
        <div className="px-6 py-4 rounded-xl bg-[rgba(0,0,0,0.3)] shadow-lg flex flex-col gap-4 w-full max-w-md border border-gray-700 h-full max-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">
              AI 3D 모델 생성
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              사진 한 장으로 3D 모델을 만들어보세요
            </p>
          </div>

          <label
            ref={dropRef}
            className={`border-2 border-dashed ${
              isDragging
                ? "border-blue-500 bg-[rgba(0,0,255,0.05)]"
                : "border-blue-300 bg-[rgba(0,0,0,0.2)]"
            } rounded-lg text-gray-300 cursor-pointer hover:text-blue-300 hover:border-blue-500 flex flex-col items-center justify-center p-8 transition-all duration-200`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUpload className="text-4xl text-blue-400 mb-3" />
            <span className="font-medium">이미지 업로드</span>
            <span className="text-xs text-gray-500 mt-1">
              JPG, PNG (10MB 이하)
            </span>
            <span className="text-xs text-gray-400 mt-1">
              파일을 드래그하여 놓거나 클릭하세요
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

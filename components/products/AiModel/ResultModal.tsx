"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls, DRACOLoader } from "three-stdlib";
import { FiX, FiRefreshCw, FiShare2, FiRotateCw, FiSave } from "react-icons/fi";
import { MdError } from "react-icons/md";

interface ResultModalProps {
  blobUrl: string;
  onClose: () => void;
  onReset: () => void;
  onSave?: () => Promise<void>;
  s3Uploading?: boolean;
  s3UploadProgress?: number;
  modelTitle?: string;
  onTitleChange?: (title: string) => void;
}

export default function ResultModal({
  blobUrl,
  onClose,
  onReset,
  onSave,
  s3Uploading = false,
  s3UploadProgress = 0,
  modelTitle = "",
  onTitleChange,
}: ResultModalProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const resizeListenerRef = useRef<(() => void) | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 회전 속도 설정 (토글)
  const toggleRotation = () => {
    setRotationSpeed((prev) => (prev > 0 ? 0 : 0.01));
  };

  // 배경 클릭 시 모달 닫기 (모달 내부 클릭은 이벤트 전파 중지)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 3D 뷰어 리소스 정리
  const cleanupResources = () => {
    console.log("🧹 3D 뷰어 리소스 정리");

    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(
          rendererRef.current.domElement
        );
      }
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      // 씬의 모든 객체 제거
      while (sceneRef.current.children.length > 0) {
        const object = sceneRef.current.children[0];
        sceneRef.current.remove(object);
      }
      sceneRef.current = null;
    }

    if (resizeListenerRef.current) {
      window.removeEventListener("resize", resizeListenerRef.current);
      resizeListenerRef.current = null;
    }

    modelRef.current = null;
    cameraRef.current = null;
  };

  // 모달이 마운트된 후 isReady 상태 업데이트
  useEffect(() => {
    // 약간의 지연 후 isReady 상태를 true로 설정
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 3D 뷰어 설정 (isReady가 true일 때만 실행)
  useEffect(() => {
    if (!isReady || !viewerRef.current || !blobUrl) {
      return;
    }

    console.log("🔄 ResultModal 초기화 시작");

    // 이전 리소스 정리
    cleanupResources();

    try {
      // 컨테이너 크기 확인
      const container = viewerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight || 400; // 높이가 0이면 기본값 사용

      console.log("📏 뷰어 크기:", width, "x", height);

      if (width === 0) {
        throw new Error("뷰어 컨테이너 너비가 0입니다");
      }

      // Scene 생성
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0xf0f0f0);

      // Camera 설정
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      cameraRef.current = camera;
      camera.position.set(0, 0, 5);

      // Renderer 설정
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xf0f0f0, 1);
      renderer.shadowMap.enabled = true;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // DOM에 추가
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 조명 설정
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight1.position.set(5, 5, 5);
      directionalLight1.castShadow = true;
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight2.position.set(-5, 5, -5);
      directionalLight2.castShadow = true;
      scene.add(directionalLight2);

      // 바닥면 그리드
      const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
      gridHelper.position.y = -2;
      scene.add(gridHelper);

      // OrbitControls 초기화
      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;
      controls.update();

      console.log("🔍 모델 로드 시작:", blobUrl);

      // GLTFLoader로 모델 로드
      const loader = new GLTFLoader();

      // DRACO 로더 설정 (압축된 메시 지원)
      try {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
        );
        // 웹워커 사용 안 함 (더 안정적)
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        loader.setDRACOLoader(dracoLoader);
        console.log("✅ DRACO 로더 설정 완료");
      } catch (error) {
        console.error("⚠️ DRACO 로더 설정 실패:", error);
        // DRACO 로더 설정 실패해도 계속 진행 (압축되지 않은 모델은 여전히 로드 가능)
      }

      // 기본 내장 모델로 전환을 위한 대체 URL
      const fallbackModelUrl =
        "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";

      // 모델 로딩 최대 시간 설정
      const loadingTimeout = setTimeout(() => {
        if (!isModelLoaded) {
          console.warn("⚠️ 모델 로딩 시간 초과, 대체 모델 사용");
          try {
            // 대체 모델 로드
            loadFallbackModel();
          } catch (e) {
            console.error("대체 모델 로드 실패:", e);
          }
        }
      }, 20000); // 20초 타임아웃

      // 참조 저장
      loadingTimeoutRef.current = loadingTimeout;

      // 대체 모델 로드 함수
      const loadFallbackModel = () => {
        loader.load(
          fallbackModelUrl,
          (gltf) => {
            console.log("✅ 대체 모델 로드 성공");
            // 기존 모델이 이미 로드된 경우 무시
            if (isModelLoaded) return;

            const model = gltf.scene;

            // 메시에 그림자 설정
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true;
                (child as THREE.Mesh).receiveShadow = true;
              }
            });

            if (sceneRef.current) {
              sceneRef.current.add(model);
              modelRef.current = model;

              // 모델 크기에 맞게 카메라 위치 조정
              const box = new THREE.Box3().setFromObject(model);
              const size = box.getSize(new THREE.Vector3()).length();
              const center = box.getCenter(new THREE.Vector3());

              model.position.x = 0 - center.x;
              model.position.z = 0 - center.z;
              model.position.y = 0 - center.y;

              if (cameraRef.current) {
                cameraRef.current.position.set(size, size * 0.5, size * 1.5);
                cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
              }

              // OrbitControls 타겟 재설정
              if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
              }

              setIsModelLoaded(true);
              setLoadingProgress(100);
              setError(null);
            }
          },
          (xhr) => {
            // 대체 모델 로딩 진행률 표시
            const progress = Math.floor((xhr.loaded / xhr.total) * 100);
            console.log(`🔄 대체 모델 로드 중: ${progress}%`);
            setLoadingProgress(progress);
          },
          (error) => {
            console.error("❌ 대체 모델 로드 오류:", error);
            setError(
              "3D 모델을 렌더링하는데 실패했습니다. 브라우저를 새로고침해 주세요."
            );
            setIsModelLoaded(false);
          }
        );
      };

      // 원본 모델 로드 시도
      let loadStarted = true;
      loader.load(
        blobUrl,
        (gltf) => {
          // 타임아웃 클리어
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }

          // 이미 다른 모델이 로드된 경우 중복 처리 방지
          if (isModelLoaded) return;

          console.log("✅ 원본 모델 로드 성공");
          const model = gltf.scene;

          // 메시에 그림자 설정
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).castShadow = true;
              (child as THREE.Mesh).receiveShadow = true;
            }
          });

          scene.add(model);
          modelRef.current = model;

          // 모델 크기에 맞게 카메라 위치 조정
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());

          model.position.x = 0 - center.x;
          model.position.z = 0 - center.z;
          model.position.y = 0 - center.y;

          camera.position.set(size, size * 0.5, size * 1.5);
          camera.lookAt(new THREE.Vector3(0, 0, 0));

          // OrbitControls 타겟 재설정
          controls.target.set(0, 0, 0);
          controls.update();

          setIsModelLoaded(true);
          setLoadingProgress(100);
        },
        (xhr) => {
          // 로딩 진행률 표시
          const progress = Math.floor((xhr.loaded / xhr.total) * 100);
          console.log(`🔄 모델 로드 중: ${progress}%`);
          setLoadingProgress(progress);
        },
        (error) => {
          console.error("❌ GLTF 로드 오류:", error);
          setError("3D 모델을 렌더링하는데 실패했습니다.");
          setIsModelLoaded(false);
        }
      );

      // 화면 크기 변경 대응 함수
      const handleResize = () => {
        if (!viewerRef.current || !cameraRef.current || !rendererRef.current)
          return;

        const width = viewerRef.current.clientWidth;
        const height = viewerRef.current.clientHeight || 400;

        if (width === 0) return;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      };

      // 리사이즈 이벤트 리스너 등록 및 참조 저장
      resizeListenerRef.current = handleResize;
      window.addEventListener("resize", handleResize);

      // 애니메이션 루프
      const animate = () => {
        animationFrameIdRef.current = requestAnimationFrame(animate);

        // 자동 회전
        if (modelRef.current && rotationSpeed > 0) {
          modelRef.current.rotation.y += rotationSpeed;
        }

        // 컨트롤 업데이트
        if (controlsRef.current) {
          controlsRef.current.update();
        }

        // 렌더링
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      // 애니메이션 시작
      animate();
    } catch (err) {
      console.error("❌ 모달 뷰어 설정 오류:", err);
      setError("3D 뷰어 초기화 중 오류가 발생했습니다.");
    }

    // 언마운트 시 정리
    return () => {
      console.log("🔚 뷰어 정리");
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current); // 타임아웃 정리
        loadingTimeoutRef.current = null;
      }
      cleanupResources();
    };
  }, [isReady, blobUrl, rotationSpeed]);

  // ESC 키 눌렀을 때 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 모델 제목 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTitleChange) {
      onTitleChange(e.target.value);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg absolute top-4 right-4 left-4 flex items-center">
          <MdError className="text-red-500 mr-2" size={24} />
          <span>{error}</span>
        </div>
      )}

      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              AI 3D 모델 결과
            </h3>
            {onSave && (
              <input
                type="text"
                value={modelTitle}
                onChange={handleTitleChange}
                placeholder="모델 제목 입력"
                className="ml-4 px-2 py-1 border rounded text-sm flex-1"
                disabled={s3Uploading}
              />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* 3D 뷰어 */}
        <div className="flex-1 min-h-[400px] relative">
          {!isModelLoaded && loadingProgress < 100 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-80 z-10">
              <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-medium text-gray-700">
                모델 로딩 중... {loadingProgress}%
              </p>
            </div>
          )}
          {s3Uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 z-20">
              <div className="w-24 h-24 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-medium text-gray-700">
                모델 저장 중... {s3UploadProgress.toFixed(0)}%
              </p>
            </div>
          )}
          <div ref={viewerRef} className="w-full h-full bg-[#f0f0f0]"></div>
        </div>

        {/* 하단 컨트롤 */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2 transition"
            >
              <FiRefreshCw size={18} />
              <span className="hidden md:block">새 모델 만들기</span>
            </button>
            <button
              onClick={toggleRotation}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2 transition"
            >
              <FiRotateCw size={18} />
              <span className="hidden md:block">
                {rotationSpeed > 0 ? "회전 중지" : "회전"}
              </span>
            </button>
          </div>

          <div className="flex gap-2">
            {onSave && (
              <button
                onClick={onSave}
                disabled={s3Uploading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSave size={18} />
                <span className="hidden md:block">
                  {s3Uploading ? "저장 중..." : "내 계정에 저장"}
                </span>
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition">
              <FiShare2 size={18} />
              <span className="hidden md:block">공유하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

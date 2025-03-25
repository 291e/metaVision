"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // 직접 three에서 가져옴
import { GLTFLoader, OrbitControls } from "three-stdlib"; // 이전에 사용 중이던 로더 유지
import { AiFillPicture } from "react-icons/ai";

const SERVER_URL =
  "ec2-43-200-145-70.ap-northeast-2.compute.amazonaws.com:5100";

export default function PhotogrammetryViewer() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [clientId] = useState(`user_${Date.now()}`);
  const [connectionInfo, setConnectionInfo] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const ws = new WebSocket(`ws://${SERVER_URL}/ws`);

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
      ws.send(JSON.stringify({ type: "connect" }));
    };
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "connect" && message.status === "ok") {
          setConnectionInfo(message.connection_info);
        }
      } catch (error) {
        console.error("WebSocket 메시지 처리 오류:", error);
      }
    };
    ws.onerror = (error) => console.error("❌ WebSocket 오류:", error);
    ws.onclose = () => console.log("🔌 WebSocket 연결 종료");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // 파일 선택 핸들러
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImageFile(event.target.files[0]);
    }
  };

  // 큐 상태 확인
  const checkQueueStatus = async (formData: FormData) => {
    try {
      const response = await fetch(
        `http://${SERVER_URL}/queue_status?connection_info=${connectionInfo}`,
        { method: "GET" }
      );
      const result = await response.json();

      if (result.status === "waiting") {
        console.log(`대기 중: ${result.position} 요청 앞에 있음`);
        const interval = 1000 + result.position * 200;
        pollingTimeoutRef.current = setTimeout(
          () => checkQueueStatus(formData),
          interval
        );
      } else if (result.status === "ready") {
        await generateModel(formData);
      } else {
        console.error("예상치 못한 큐 상태:", result.status);
      }
    } catch (error) {
      console.error("큐 상태 확인 오류:", error);
    }
  };

  // 모델 생성 요청
  const generateModel = async (formData?: FormData) => {
    if (!imageFile || !connectionInfo) {
      console.error("이미지 파일 또는 connection_info가 누락됨");
      return;
    }

    setLoading(true);
    const data = formData || new FormData();
    if (!formData) {
      data.append("client_id", clientId);
      data.append("image_file", imageFile);
      data.append("connection_info", connectionInfo);
    }

    try {
      const response = await fetch(`http://${SERVER_URL}/generate`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.model_url || result.glb_url) {
        setModelUrl(result.model_url || result.glb_url);
      } else {
        alert("모델 생성 실패: " + (result.error || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("모델 생성 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 버튼 클릭 시 프로세스 시작
  const handleGenerateClick = () => {
    if (!connectionInfo) {
      console.error("connection_info가 아직 준비되지 않음");
      return;
    }
    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("image_file", imageFile!);
    formData.append("connection_info", connectionInfo);
    checkQueueStatus(formData);
  };

  // 모델 URL -> Blob URL 변환
  useEffect(() => {
    if (modelUrl) {
      fetch(modelUrl)
        .then((res) => res.blob())
        .then((blob) => {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          setBlobUrl(URL.createObjectURL(blob));
        })
        .catch((err) => console.error("Blob 변환 오류:", err));
    }
  }, [modelUrl]);
  // 3D 뷰어 설정
  useEffect(() => {
    if (viewerRef.current && blobUrl) {
      const scene = new THREE.Scene();
      scene.background = null; // 배경을 투명하게 설정

      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      }); // 알파 채널 활성화
      renderer.setSize(400, 400);
      renderer.setClearColor(0x000000, 0); // 투명 배경을 위한 설정

      viewerRef.current!.innerHTML = "";
      viewerRef.current!.appendChild(renderer.domElement);

      // 조명 설정 (밝기 개선)
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // 주변광 강도 증가 (0.5 -> 1.0)
      scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5); // 방향성 조명 강도 증가 (1 -> 1.5)
      directionalLight1.position.set(5, 5, 5);
      scene.add(directionalLight1);

      // 추가 조명 (옵션: 모델을 더 밝게 하기 위해)
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight2.position.set(-5, 5, -5); // 반대 방향에서 조명 추가
      scene.add(directionalLight2);

      // 모델 로드
      const loader = new GLTFLoader();
      loader.load(
        blobUrl,
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);

          // 모델 크기에 따라 카메라 위치 조정
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());

          camera.position.set(center.x, center.y, center.z + size * 2);
          camera.lookAt(center);

          // OrbitControls 추가
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.target = center;
          controls.update();

          animate();
        },
        undefined,
        (error) => console.error("GLTF 로드 오류:", error)
      );
      //@ts-ignore
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
    }
  }, [blobUrl]);

  // polling 정리
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    };
  }, []);

  const resetProcess = () => {
    setImageFile(null);
    setLoading(false);
    setModelUrl(null);
    setBlobUrl(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {!imageFile ? (
        <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md flex flex-col gap-4 w-full max-w-md h-full max-h-[250px]">
          <label className="px-6 border-2 rounded-md text-gray-500 cursor-pointer hover:text-white bg-[rgba(0,0,0,0.4)] border-dashed flex flex-col items-center justify-center p-6 min-w-52 transition">
            <AiFillPicture className="text-4xl text-gray-600  mb-2" />

            <span>사진 불러오기</span>
            <input type="file" onChange={onFileChange} className="hidden" />
          </label>
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          >
            {loading ? "Generating..." : "AI 3D Model 생성"}
          </button>
        </div>
      ) : (
        <>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-24 h-auto"
          />
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Generating..." : "AI 3D Model 생성"}
          </button>
        </>
      )}

      {blobUrl && (
        <>
          <div
            ref={viewerRef}
            className="w-[400px] h-[400px] bg-gray-200"
          ></div>
          <div className="flex gap-4">
            <button
              onClick={resetProcess}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              다시 만들기
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              공유하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

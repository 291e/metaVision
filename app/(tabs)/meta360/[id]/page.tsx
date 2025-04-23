"use client";
import { EDIT_PRODUCT_MUTATION } from "@/app/api/product/mutation";
import { PRODUCT_DETAIL_QUERY } from "@/app/api/product/query";
import {
  EditProductMutation,
  EditProductMutationVariables,
  ProductDetailQuery,
  ProductDetailQueryVariables,
} from "@/app/gql/graphql";
import useUser from "@/app/hooks/useUser";
import { useMutation, useQuery } from "@apollo/client";
import {
  UserIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ShareIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PresentationControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import Model from "@/components/products/Model";
import { useControls, folder, Leva, button } from "leva";
import Link from "next/link";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: userData } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // 상품 상세 정보 가져오기
  const { data, loading, error } = useQuery<
    ProductDetailQuery,
    ProductDetailQueryVariables
  >(PRODUCT_DETAIL_QUERY, {
    variables: {
      id,
    },
    onCompleted: (data) => {
      if (data?.productDetail) {
        setEditedTitle(data.productDetail.title ?? "");
      }
    },
  });

  // 상품 수정 뮤테이션
  const [editProduct, { loading: editLoading }] = useMutation<
    EditProductMutation,
    EditProductMutationVariables
  >(EDIT_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      if (data.editProduct.success) {
        console.log("상품 수정 성공");
        setEditMode(false);
      } else {
        console.log("수정 실패");
      }
    },
  });

  const productDetail = data?.productDetail;

  // Leva 컨트롤 - 고급 설정
  const {
    ambientLightIntensity,
    directionalLightIntensity,
    pointLightIntensity,
    showAmbientLight,
    showDirectionalLight,
    showPointLight,
    ambientLightColor,
    directionalLightColor,
    pointLightColor,
    directionalLightPosition,
    pointLightPosition,
  } = useControls({
    Lighting: folder({
      // 조명 활성화 여부
      showAmbientLight: { value: true, label: "주변광" },
      showDirectionalLight: { value: true, label: "방향광" },
      showPointLight: { value: true, label: "포인트 광원" },
      // 조명 강도
      ambientLightIntensity: {
        value: 3,
        min: 0,
        max: 10,
        step: 0.1,
        label: "주변광 강도",
      },
      directionalLightIntensity: {
        value: 1.5,
        min: 0,
        max: 10,
        step: 0.1,
        label: "방향광 강도",
      },
      pointLightIntensity: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        label: "포인트 광원 강도",
      },
      // 조명 색상
      ambientLightColor: { value: "#ffffff", label: "주변광 색상" },
      directionalLightColor: {
        value: "#ffffff",
        label: "방향광 색상",
      },
      pointLightColor: { value: "#ffffff", label: "포인트 광원 색상" },
      // 조명 위치
      directionalLightPosition: {
        value: { x: 0, y: 0, z: 0 },
        step: 0.1,
        label: "방향광 위치",
      },
      pointLightPosition: {
        value: { x: 0, y: 5, z: 0 },
        step: 0.1,
        label: "포인트 광원 위치",
      },
      resetLighting: button(() => {
        // 기본 설정으로 리셋
        controls.ambientLightIntensity = 3;
        controls.directionalLightIntensity = 1.5;
        controls.pointLightIntensity = 50;
        controls.ambientLightColor = "#ffffff";
        controls.directionalLightColor = "#ffffff";
        controls.pointLightColor = "#ffffff";
        controls.directionalLightPosition = { x: 0, y: 0, z: 0 };
        controls.pointLightPosition = { x: 0, y: 5, z: 0 };
      }),
    }),
  });

  // 조명 설정에 대한 참조
  const controls = {
    ambientLightIntensity,
    directionalLightIntensity,
    pointLightIntensity,
    ambientLightColor,
    directionalLightColor,
    pointLightColor,
    directionalLightPosition,
    pointLightPosition,
  };

  // 전체 화면 처리
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 조명 설정 표시 토글
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // 스크린샷 촬영
  const takeScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${productDetail?.title || "model"}-screenshot.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">모델을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    console.error("GraphQL 오류:", error.graphQLErrors);
    console.error("네트워크 오류:", error.networkError);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-700 mb-6">{error.message}</p>
          <Link
            href="/meta360"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    editProduct({
      variables: {
        id,
        title: editedTitle,
      },
    });
  };

  // 3D 모델이 렌더링될 영역의 스타일
  const modelContainerStyle = isFullscreen
    ? "fixed inset-0 z-50 bg-white"
    : "relative h-[700px] md:h-[800px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-blue-50 to-white";

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 md:py-8 bg-gray-50 min-h-screen">
      {productDetail ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* 헤더 */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center space-x-4">
              <Link
                href="/meta360"
                className="p-2 rounded-full hover:bg-blue-700 transition"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <h1 className="text-base md:text-xl font-bold truncate max-w-xs md:max-w-md">
                {editMode ? "모델 수정" : productDetail.title || "3D 모델"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {(userData?.getMyInfo?.isAdmin ||
                userData?.getMyInfo?.id === productDetail.id) && (
                <button
                  className="flex items-center px-3 md:px-4 py-1 md:py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition text-sm"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1" />
                  {editMode ? "취소" : "수정"}
                </button>
              )}
            </div>
          </div>

          {/* 편집 모드 */}
          {editMode && (
            <div className="p-4 md:p-6 bg-blue-50">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="모델 이름 입력"
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-4 md:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  저장
                </button>
              </div>
            </div>
          )}

          {/* 3D 뷰어 컨트롤 버튼들 */}
          <div className="p-3 md:p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="px-3 md:px-4 py-1 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs md:text-sm flex items-center"
              >
                {isFullscreen ? "일반 화면" : "전체 화면"}
              </button>
              <button
                onClick={toggleControls}
                className="px-3 md:px-4 py-1 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs md:text-sm flex items-center hidden md:inline-flex"
              >
                {showControls ? "설정 숨기기" : "조명 설정"}
              </button>
              <button
                onClick={takeScreenshot}
                className="px-3 md:px-4 py-1 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs md:text-sm flex items-center"
              >
                <CameraIcon className="w-4 h-4 mr-1" />
                스크린샷
              </button>
            </div>
            <div className="hidden md:block">
              <p className="text-xs md:text-sm text-gray-500">
                마우스로 드래그하여 모델을 회전할 수 있습니다
              </p>
            </div>
          </div>

          {/* 3D 모델 뷰어 */}
          <div className={`${modelContainerStyle} relative`}>
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              }
            >
              <Canvas
                camera={{
                  position: [0, 0, 100],
                  fov: 30,
                  near: 0.1,
                  far: 1000,
                }}
                style={{ width: "100%", height: "100%" }}
                shadows
              >
                <PresentationControls
                  global
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 3, Math.PI / 3]}
                  azimuth={[-Math.PI, Math.PI]}
                  config={{ mass: 2, tension: 400 }}
                  snap={{ mass: 4, tension: 300 }}
                >
                  {showAmbientLight && (
                    <ambientLight
                      intensity={ambientLightIntensity}
                      color={ambientLightColor}
                    />
                  )}
                  {showDirectionalLight && (
                    <directionalLight
                      position={[
                        directionalLightPosition.x,
                        directionalLightPosition.y,
                        directionalLightPosition.z,
                      ]}
                      intensity={directionalLightIntensity}
                      color={directionalLightColor}
                      castShadow
                    />
                  )}
                  {showPointLight && (
                    <pointLight
                      position={[
                        pointLightPosition.x,
                        pointLightPosition.y,
                        pointLightPosition.z,
                      ]}
                      intensity={pointLightIntensity}
                      color={pointLightColor}
                      castShadow
                    />
                  )}
                  <group position={[0, -15, 0]} scale={1.0}>
                    <Model
                      objUrl={productDetail.result_obj || ""}
                      textureUrls={{
                        diffuse: productDetail.result_texture || undefined,
                        ao: productDetail.result_ao || undefined,
                        normal: productDetail.result_normal || undefined,
                        roughness: productDetail.result_roughness || undefined,
                      }}
                    />
                  </group>
                </PresentationControls>
                <Environment preset="sunset" />
                <ContactShadows
                  position={[0, -20, 0]}
                  opacity={0.5}
                  scale={50}
                  blur={2}
                  far={10}
                />
                <OrbitControls
                  enablePan={true}
                  enableRotate={true}
                  enableZoom={true}
                  rotateSpeed={1}
                  minZoom={0.3}
                  maxZoom={20}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 1.5}
                  target={[0, -15, 0]}
                  minDistance={30}
                  maxDistance={200}
                />
              </Canvas>

              {/* 모델 정보 오버레이 */}
              {!isFullscreen && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 md:p-3 rounded-lg shadow-md text-xs md:text-sm">
                  <h3 className="font-medium text-gray-800">
                    모델 ID: {productDetail.id}
                  </h3>
                  {productDetail.createdAt && (
                    <p className="text-xs text-gray-500">
                      생성일:{" "}
                      {new Date(productDetail.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* 전체화면 모드 종료 버튼 */}
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </Suspense>
          </div>

          {/* 모델 정보 및 설명 */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  {productDetail.title || "3D 모델"}
                </h2>

                {productDetail.createdAt && (
                  <p className="text-xs md:text-sm text-gray-500">
                    생성일:{" "}
                    {new Date(productDetail.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0 mt-4 md:mt-0 flex flex-col md:flex-row md:items-center md:space-x-2">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition mb-2 md:mb-0 text-sm">
                  <ShareIcon className="w-4 h-4 mr-1" />
                  공유하기
                </button>
                <Link
                  href="/meta360"
                  className="flex items-center px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition text-sm"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  목록으로
                </Link>
              </div>
            </div>
          </div>

          {/* Leva 패널 - 미디움 크기 이상의 화면에서만 표시 */}
          <div className="hidden md:block">
            {showControls && (
              <Leva collapsed={false} oneLineLabels={true} hideCopyButton />
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            상품 데이터를 불러오지 못했습니다.
          </h2>
          <Link
            href="/meta360"
            className="inline-flex items-center px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            목록으로 돌아가기
          </Link>
        </div>
      )}
    </div>
  );
}

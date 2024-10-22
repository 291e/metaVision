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
import { UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "@/components/products/Model";
import { useControls, folder, Leva } from "leva";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: userData } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

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

  // Leva 컨트롤 추가
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
      showAmbientLight: { value: true, label: "Show Ambient Light" },
      showDirectionalLight: { value: true, label: "Show Directional Light" },
      showPointLight: { value: true, label: "Show Point Light" },
      // 조명 강도
      ambientLightIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
      directionalLightIntensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
      pointLightIntensity: { value: 50, min: 0, max: 100, step: 1 },
      // 조명 색상
      ambientLightColor: { value: "#ffffff", label: "Ambient Light Color" },
      directionalLightColor: {
        value: "#ffffff",
        label: "Directional Light Color",
      },
      pointLightColor: { value: "#ffffff", label: "Point Light Color" },
      // 조명 위치
      directionalLightPosition: {
        value: { x: 0, y: 0, z: 0 },
        step: 0.1,
        label: "Directional Light Position",
      },
      pointLightPosition: {
        value: { x: 0, y: 5, z: 0 },
        step: 0.1,
        label: "Point Light Position",
      },
    }),
  });

  if (loading) return <h1>로딩 중...</h1>;
  if (error) {
    console.error("GraphQL 오류:", error.graphQLErrors);
    console.error("네트워크 오류:", error.networkError);
    return <p className="text-black text-2xl">에러: {error.message}</p>;
  }

  const handleSaveEdit = () => {
    editProduct({
      variables: {
        id,
        title: editedTitle,
      },
    });
  };

  return (
    <div>
      {productDetail ? (
        <>
          {(userData?.getMyInfo?.isAdmin ||
            userData?.getMyInfo?.id === productDetail.id) && (
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700 justify-between">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full overflow-hidden">
                  <UserIcon />
                </div>
                <div></div>
              </div>
              <button
                className="cursor-pointer p-2 bg-meta rounded-lg text-white"
                onClick={() => setEditMode((prev) => !prev)}
              >
                {editMode ? "취소" : "수정"}
              </button>
            </div>
          )}
          <div className="p-5">
            {editMode ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-meta text-white rounded"
                  disabled={editLoading}
                >
                  저장
                </button>
              </div>
            ) : (
              <>
                <span className="text-xl">{productDetail.id}</span>
                <h1>{productDetail.title.substring(0, 10)}</h1>
              </>
            )}
          </div>
          <div className="flex h-screen max-h-[768px] px-40">
            <Canvas
              camera={{ position: [0, 0, 20] }}
              style={{ width: "100%", height: "100%" }}
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
                />
              )}
              <Model
                objUrl={productDetail.result_obj || ""}
                textureUrls={{
                  diffuse: productDetail.result_texture || undefined,
                  ao: productDetail.result_ao || undefined,
                  normal: productDetail.result_normal || undefined,
                  roughness: productDetail.result_roughness || undefined,
                }}
              />
              <OrbitControls
                enableRotate={true}
                enableZoom={true}
                rotateSpeed={1}
                minZoom={1}
                maxZoom={20}
              />
            </Canvas>
          </div>
          {/* Leva 패널 추가 */}
          <Leva collapsed={false} oneLineLabels={true} />
        </>
      ) : (
        <p>상품 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
}

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
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-stdlib";

export default function ProductDetail({ params }: { params: { id: string } }) {
	const { id } = params;
	const { data: userData } = useUser();
	const [editMode, setEditMode] = useState(false);
	const [editedTitle, setEditedTitle] = useState("");
	const meshRef = useRef<THREE.Group>(new THREE.Group());

	// 상품 세부 정보 쿼리 실행
	const { data, loading, error } = useQuery<ProductDetailQuery, ProductDetailQueryVariables>(PRODUCT_DETAIL_QUERY, {
		variables: {
			id,
		},
		onCompleted: (data) => {
			if (data?.productDetail) {
				setEditedTitle(data.productDetail.title ?? "");
			}
		},
	});

	// 상품 수정 뮤테이션 실행
	const [editProduct, { loading: editLoading }] = useMutation<EditProductMutation, EditProductMutationVariables>(
		EDIT_PRODUCT_MUTATION,
		{
			onCompleted: async (data) => {
				const {
					editProduct: { success, message },
				} = data;
				if (success) {
					console.log("상품 수정 성공");
					setEditMode(false);
				} else {
					console.log("권한 없음");
				}
			},
		}
	);

	const productDetail = data?.productDetail;

	// OBJ 및 MTL 파일을 로드하고 3D 모델을 설정
	useEffect(() => {
		if (productDetail?.result_obj && productDetail?.result_mtl) {
			const mtlLoader = new MTLLoader();
			mtlLoader.load(productDetail.result_mtl, (materials) => {
				materials.preload();
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				/* @ts-ignore */
				objLoader.load(productDetail.result_obj, (object) => {
					object.scale.set(10, 10, 10);
					meshRef.current.add(object);
				});
			});
		}
	}, [productDetail?.result_obj, productDetail?.result_mtl]);

	// 추가 텍스처(ao, normal, roughness 등)를 로드하고 적용
	useEffect(() => {
		if (productDetail) {
			const textureLoader = new THREE.TextureLoader();
			const aoMap = productDetail.result_ao ? textureLoader.load(productDetail.result_ao) : undefined;
			const normalMap = productDetail.result_normal ? textureLoader.load(productDetail.result_normal) : undefined;
			const roughnessMap = productDetail.result_roughness
				? textureLoader.load(productDetail.result_roughness)
				: undefined;
			const textureMap = productDetail.result_texture
				? textureLoader.load(productDetail.result_texture)
				: undefined;

			if (meshRef.current) {
				meshRef.current.traverse((child) => {
					if ((child as THREE.Mesh).isMesh) {
						const mesh = child as THREE.Mesh;
						const material = mesh.material as THREE.MeshStandardMaterial;
						if (aoMap) material.aoMap = aoMap;
						if (normalMap) material.normalMap = normalMap;
						if (roughnessMap) material.roughnessMap = roughnessMap;
						if (textureMap) material.map = textureMap;
					}
				});
			}
		}
	}, [productDetail]);

	// 로딩 중일 때 로딩 메시지 표시
	if (loading) return <h1>로딩 중...</h1>;
	if (error) {
		console.error("GraphQL 오류:", error.graphQLErrors);
		console.error("네트워크 오류:", error.networkError);
		return <p className="text-black text-2xl">에러: {error.message}</p>;
	}

	// 수정 저장 버튼 핸들러
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
					{(userData?.getMyInfo?.isAdmin || userData?.getMyInfo?.id === productDetail.id) && (
						<div className="p-5 flex items-center gap-3 border-b border-neutral-700 justify-between">
							<div className="flex items-center gap-2">
								<div className="size-10 rounded-full overflow-hidden">
									<UserIcon />
								</div>
								<div></div>
							</div>
							<button
								className="cursor-pointer p-2 bg-meta rounded-lg text-white"
								onClick={() => setEditMode((prev) => !prev)}>
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
									disabled={editLoading}>
									저장
								</button>
							</div>
						) : (
							<>
								<span className="text-xl">{productDetail.title}</span>
								<h1>{productDetail.title.substring(0, 10)}</h1>
							</>
						)}
					</div>
					<div className="flex h-screen">
						<Canvas>
							<ambientLight intensity={2} />
							<directionalLight position={[5, 5, 5]} intensity={1.5} />
							<OrbitControls
								enableRotate={true}
								enableZoom={true}
								rotateSpeed={1}
								minZoom={1}
								maxZoom={20}
							/>
							<primitive object={meshRef.current} />
						</Canvas>
					</div>
				</>
			) : (
				<p>상품 데이터를 불러오지 못했습니다.</p>
			)}
		</div>
	);
}

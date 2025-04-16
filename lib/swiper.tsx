"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";
import {
  AllProductQuery,
  AllProductQueryVariables,
  Product,
} from "@/app/gql/graphql";
import Image from "next/image";
import { FiBox, FiLoader, FiEye } from "react-icons/fi";
import useUser from "@/app/hooks/useUser";
import axios from "axios";
import ResultModal from "@/components/products/AiModel/ResultModal";

interface S3Model {
  key: string;
  url: string;
  title: string;
  lastModified: Date | string;
}

const ProductGrid: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const loadingRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10; // 한 번에 보여줄 아이템 수
  const [s3Models, setS3Models] = useState<S3Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<S3Model | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: userData } = useUser();
  const userId = userData?.getMyInfo?.id;

  // Apollo Client의 useQuery 훅을 사용하여 데이터 패칭
  const {
    data,
    loading: graphqlLoading,
    error: graphqlError,
    fetchMore,
  } = useQuery<AllProductQuery, AllProductQueryVariables>(ALL_PRODUCT_QUERY, {
    variables: { offset: 0 }, // 초기 로드시 offset 0
    fetchPolicy: "network-only", // 항상 네트워크에서 최신 데이터 가져오기
  });

  // 데이터가 로드될 때 상품 목록 업데이트
  useEffect(() => {
    if (data?.allProduct) {
      const filteredProducts = data.allProduct.filter(
        (product): product is Product => product !== null
      );
      setAllProducts(filteredProducts);
    }
  }, [data]);

  // S3에서 AI 모델 가져오기
  const fetchS3Models = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);

    try {
      console.log("S3 모델 가져오기 요청:", `/api/ai-models?userId=${userId}`);
      const response = await axios.get(`/api/ai-models?userId=${userId}`);

      if (response.data && Array.isArray(response.data.models)) {
        setS3Models(response.data.models);
        console.log(
          "S3 모델 로드 성공:",
          response.data.models.length,
          "개 모델"
        );
      } else {
        console.warn("유효한 모델 데이터가 없습니다:", response.data);
        setS3Models([]);
      }
    } catch (err) {
      console.error("S3 모델 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 S3 모델 가져오기
  useEffect(() => {
    if (userId) {
      fetchS3Models();
    }
  }, [userId]);

  // 무한 스크롤 구현
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || graphqlLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;

            // 다음 데이터 가져오기
            fetchMore({
              variables: {
                offset: nextPage * itemsPerPage,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult || !fetchMoreResult.allProduct)
                  return prev;

                // 추가 데이터가 없으면 hasMore를 false로 설정
                if (fetchMoreResult.allProduct.length === 0) {
                  setHasMore(false);
                  return prev;
                }

                return {
                  allProduct: [
                    ...(prev.allProduct || []),
                    ...(fetchMoreResult.allProduct || []),
                  ],
                };
              },
            });

            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, graphqlLoading, hasMore, fetchMore, itemsPerPage]
  );

  // AI 3D 모델 필터링 로직
  const isAI3DModel = (product: Product) => {
    if (!product.original_photo || !Array.isArray(product.original_photo)) {
      return false;
    }

    return product.original_photo.some(
      (photo) =>
        photo &&
        (photo.includes("AI_3D_Models") ||
          photo.includes("AI_3D_") ||
          (product.title && product.title.includes("AI_3D_")))
    );
  };

  // S3 모델 클릭 핸들러
  const handleModelClick = (model: S3Model) => {
    console.log("S3 모델 열기:", model);
    setSelectedModel(model);
    setShowModal(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModel(null);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    setLoading(true);
    fetchS3Models();

    // GraphQL 데이터 새로고침
    fetchMore({
      variables: { offset: 0 },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) return { allProduct: [] };
        return fetchMoreResult;
      },
    });
  };

  // 에러 상태 처리
  if (graphqlError)
    return <div>에러가 발생했습니다: {graphqlError.message}</div>;

  // 초기 로딩 중이고 데이터가 없는 경우
  if (
    graphqlLoading &&
    allProducts.length === 0 &&
    loading &&
    s3Models.length === 0
  ) {
    return (
      <div className="flex justify-center items-center py-10">
        <FiLoader className="animate-spin text-blue-500 text-3xl mr-2" />
        <p>상품을 불러오는 중입니다...</p>
      </div>
    );
  }

  // 데이터가 없거나 비어있는 경우 처리
  if (
    (!data || !data.allProduct || data.allProduct.length === 0) &&
    s3Models.length === 0
  )
    return <div className="text-center py-10">상품이 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-2">
      {/* 섹션 제목 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">전체 상품</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
        >
          새로고침
        </button>
      </div>

      {/* S3 모델 섹션 */}
      {s3Models.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            내 AI 3D 모델
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {s3Models.map((model, index) => (
              <div
                key={`s3-${model.key}`}
                className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col"
              >
                <div className="relative h-40 bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-100">
                    <FiBox className="text-blue-500" size={40} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleModelClick(model)}
                      className="p-2 bg-blue-500 text-white rounded-full"
                    >
                      <FiEye size={20} />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs">
                    AI 3D
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {model.title || "AI 3D 모델"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {typeof model.lastModified === "string"
                      ? new Date(model.lastModified).toLocaleDateString()
                      : model.lastModified instanceof Date
                      ? model.lastModified.toLocaleDateString()
                      : "최근 생성됨"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 일반 상품 섹션 */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">모든 상품</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product, index) => {
          // 마지막 아이템에 ref 추가
          const isLastItem = index === allProducts.length - 1;
          const is3DModel = isAI3DModel(product);

          return (
            <div
              key={product.id}
              ref={isLastItem ? lastElementRef : null}
              className="flex flex-col justify-center rounded-2xl items-center text-black mt-2 shadow-lg py-4 bg-white"
            >
              <Link
                href={`/meta360/${product.id}`}
                className="relative size-60 rounded-md mx-auto overflow-hidden"
              >
                {product.original_photo &&
                product.original_photo.length > 0 &&
                product.original_photo[0] ? (
                  <Image
                    src={product.original_photo[0]}
                    alt={`${product.title} 이미지`}
                    width={250}
                    height={250}
                    className="rounded-2xl object-cover h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 rounded-2xl">
                    <FiBox className="text-blue-500" size={40} />
                  </div>
                )}

                {is3DModel && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs">
                    AI 3D
                  </div>
                )}
              </Link>

              <div className="my-4 text-center">
                <h3 className="font-medium text-gray-900 truncate max-w-[220px] mb-1">
                  {product.title || "상품명 없음"}
                </h3>
                <Link
                  className="inline-block mt-2 px-4 py-1 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 transition-all text-sm"
                  href={`/meta360/${product.id}`}
                >
                  보러가기
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 추가 로딩 표시기 */}
      {(graphqlLoading || loading) && page > 1 && (
        <div className="text-center py-6" ref={loadingRef}>
          <FiLoader className="animate-spin text-blue-500 text-xl inline-block" />
          <span className="ml-2">더 불러오는 중...</span>
        </div>
      )}

      {/* 선택된 S3 모델에 대한 모달 */}
      {showModal && selectedModel && (
        <ResultModal
          blobUrl={selectedModel.url}
          onClose={handleCloseModal}
          onReset={handleCloseModal}
          modelTitle={selectedModel.title}
        />
      )}
    </div>
  );
};

export default ProductGrid;

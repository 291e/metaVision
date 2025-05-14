"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useUser from "@/app/hooks/useUser";
import { useQuery } from "@apollo/client";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";
import { Product } from "@/app/gql/graphql";
import { FiEye, FiLoader, FiBox, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import ResultModal from "./AiModel/ResultModal";
import { formatFileSize } from "@/lib/utils";

interface S3Model {
  key: string;
  url: string;
  title: string;
  lastModified: Date | string;
  fileName?: string;
  size?: number | string;
  viewerUrl?: string;
  modelId?: string;
  thumbnail?: string;
}

const AiModelSlide: React.FC = () => {
  const [aiModels, setAiModels] = useState<Product[]>([]);
  const [s3Models, setS3Models] = useState<S3Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<S3Model | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const { data: userData } = useUser();
  const userId = userData?.getMyInfo?.id;

  // GraphQL로 저장된 모델 가져오기 (기존 방식)
  const { data, refetch } = useQuery(ALL_PRODUCT_QUERY, {
    variables: { offset: 0 },
    fetchPolicy: "network-only",
    skip: !userId, // 로그인하지 않은 경우 쿼리 건너뛰기
  });

  // 모든 소스에서 모델 데이터 가져오기
  const fetchAllModels = async () => {
    setLoading(true);
    setError(null);

    try {
      // GraphQL 데이터 새로고침
      await refetch();

      // S3에서 직접 모델 가져오기
      await fetchS3Models(false); // loading 상태를 설정하지 않음
    } catch (err) {
      console.error("데이터 가져오기 오류:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
      setInitialLoading(false); // 초기 로딩 완료
    }
  };

  // 컴포넌트 마운트 시와 userId 변경 시 데이터 가져오기
  useEffect(() => {
    if (userId) {
      fetchAllModels();
    } else {
      // 로그인하지 않은 경우 로딩 상태 해제
      setLoading(false);
      setInitialLoading(false);
    }

    // 컴포넌트 언마운트 시 로딩 상태 초기화
    return () => {
      setLoading(false);
      setInitialLoading(false);
    };
  }, [userId]);

  // S3에서 직접 모델 파일 목록 가져오기
  const fetchS3Models = async (setLoadingState = true) => {
    if (!userId) {
      if (setLoadingState) {
        setLoading(false);
        setInitialLoading(false);
      }
      return;
    }

    if (setLoadingState) setLoading(true);

    try {
      console.log("S3 모델 가져오기 요청:", `/api/ai-models?userId=${userId}`);

      // AI 모델 API를 사용하여 모델 목록 가져오기
      const response = await axios.get(`/api/ai-models?userId=${userId}`);

      console.log("API 응답:", response.data);

      if (response.data && Array.isArray(response.data.models)) {
        // 응답 구조에 맞게 데이터 포맷 처리
        const formattedModels = response.data.models.map((model: any) => ({
          key: model.key || model.fileName || `model-${Date.now()}`,
          url: model.url,
          title: model.title || "AI 3D 모델",
          lastModified: model.lastModified || new Date().toISOString(),
          fileName: model.fileName || model.key,
          size: model.size || "알 수 없음",
          viewerUrl:
            model.viewerUrl || `/viewer?model=${encodeURIComponent(model.url)}`,
          modelId: model.modelId || model.key,
          thumbnail: model.thumbnail,
        }));

        setS3Models(formattedModels);
        console.log("S3 모델 로드 성공:", formattedModels.length, "개 모델");
      } else {
        console.warn("유효한 모델 데이터가 없습니다:", response.data);
        setS3Models([]);
      }
    } catch (err) {
      console.error("S3 모델 로딩 오류:", err);
      setError("모델 로드 중 오류가 발생했습니다. 새로고침을 시도해보세요.");
    } finally {
      if (setLoadingState) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  };

  // GraphQL 데이터에서 AI 3D 모델 필터링
  useEffect(() => {
    if (data?.allProduct) {
      // AI 3D 모델 필터링 로직 개선
      const products = data.allProduct.filter((product: any) => {
        // null 체크
        if (
          !product ||
          !product.original_photo ||
          !Array.isArray(product.original_photo)
        ) {
          return false;
        }

        // 여러 필터링 조건 추가
        return product.original_photo.some((photo: string) => {
          return (
            photo &&
            (photo.includes("AI_3D_Models") ||
              photo.includes("AI_3D_") ||
              (product.title && product.title.includes("AI_3D_")))
          );
        });
      });

      setAiModels(products);
    }
  }, [data]);

  // 모델 클릭 핸들러
  const handleModelClick = async (model: S3Model) => {
    console.log("모델 열기:", model);

    // 사용자에게 확인 메시지 표시
    if (!window.confirm("3D 모델을 보시겠습니까?")) {
      return;
    }

    // 로딩 상태 설정
    setLoading(true);

    try {
      // 3D 뷰어 모달을 먼저 표시하고 모델 URL 전달
      setSelectedModel({
        ...model,
      });

      // 모달 표시
      setShowModal(true);
    } catch (error) {
      console.error("모델 로드 오류:", error);
      setError(
        `모델을 불러오는데 실패했습니다: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModel(null);
  };

  // 무한 스크롤 관찰자 설정
  const observer = useRef<IntersectionObserver | null>(null);
  const lastModelElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          // 실제 API 페이지네이션이 없으므로 무한 스크롤 시뮬레이션
          setHasMore(false); // 모든 데이터를 이미 불러왔으므로 hasMore 비활성화
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 모든 모델 통합 (S3 모델 + GraphQL 모델)
  const allModels = [...s3Models, ...aiModels];

  // GraphQL과 S3에서 모델이 모두 없는 경우
  const hasModels = allModels.length > 0;

  // 로딩 중 표시
  if (initialLoading) {
    return (
      <div className="text-center py-10 flex flex-col items-center">
        <FiLoader className="animate-spin text-blue-500 text-3xl mb-2" />
        <p>AI 3D 모델을 불러오는 중...</p>
      </div>
    );
  }

  // 오류 표시
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchAllModels}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!hasModels) {
    return (
      <div className="text-center py-10">
        <p>저장된 AI 3D 모델이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-600">
          {userId
            ? "AI 3D 모델을 생성하고 저장해보세요! (모델 생성 후 저장하는데 시간이 걸릴 수 있습니다)"
            : "로그인하시면 AI 3D 모델을 생성할 수 있습니다."}
        </p>
        <button
          onClick={fetchAllModels}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2">
      {/* 로그인 안내 메시지 */}
      {!userId && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                로그인하시면 AI 3D 모델을 생성하고 저장할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 섹션 제목과 새로고침 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">내 AI 3D 모델</h2>
        <button
          onClick={fetchAllModels}
          className="flex items-center px-4 py-2 text-blue-500 hover:text-blue-700 transition"
        >
          <FiRefreshCw className="mr-2" />
          새로고침
        </button>
      </div>

      {/* S3 모델 섹션 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {s3Models.map((model, index) => (
          <div
            key={`s3-${model.key}`}
            ref={index === s3Models.length - 1 ? lastModelElementRef : null}
            className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col"
          >
            <div className="relative h-40 bg-gray-100">
              {model.thumbnail && model.thumbnail.trim() !== "" ? (
                <div className="relative w-full h-full">
                  <Image
                    src={model.thumbnail}
                    alt={model.title || "AI 3D 모델 썸네일"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={true}
                    loading="lazy"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아이콘으로 대체
                      console.log("썸네일 이미지 로드 실패:", model.thumbnail);
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add(
                          "flex",
                          "items-center",
                          "justify-center",
                          "bg-blue-100"
                        );

                        // 이미 아이콘이 있는지 확인
                        const existingIcon =
                          parent.querySelector(".fallback-icon");
                        if (!existingIcon) {
                          const iconElement = document.createElement("div");
                          iconElement.className =
                            "text-blue-500 flex items-center justify-center fallback-icon";
                          iconElement.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                          parent.appendChild(iconElement);
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-100">
                  <FiBox className="text-blue-500" size={40} />
                </div>
              )}
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
              <div>
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
                {model.size && (
                  <p className="text-xs text-gray-500">
                    크기:{" "}
                    {typeof model.size === "number"
                      ? formatFileSize(model.size)
                      : model.size}
                  </p>
                )}
              </div>
              <Link
                href={
                  model.viewerUrl ||
                  `/viewer?model=${encodeURIComponent(model.url)}`
                }
                className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEye className="mr-2" />
                모델 보기
              </Link>
            </div>
          </div>
        ))}

        {/* GraphQL에서 가져온 AI 3D 모델 */}
        {aiModels.map((model) => (
          <div
            key={`gql-${model.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col"
          >
            <div className="relative h-40 bg-gray-100">
              {model.original_photo && model.original_photo[0] ? (
                <Image
                  src={model.original_photo[0]}
                  alt={model.title || "AI 3D 모델"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-100">
                  <FiBox className="text-blue-500" size={40} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                <Link
                  href={`/meta360/${model.id}`}
                  className="p-2 bg-blue-500 text-white rounded-full"
                  title="3D 모델 보기"
                >
                  <FiEye size={20} />
                </Link>
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
                {new Date(model.createdAt).toLocaleDateString()}
              </p>
              <Link
                href={`/meta360/${model.id}`}
                className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEye className="mr-2" />
                모델 보기
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 추가 로딩 표시기 */}
      {loading && page > 1 && (
        <div className="text-center py-4">
          <FiLoader className="animate-spin text-blue-500 text-xl inline-block" />
          <span className="ml-2">더 불러오는 중...</span>
        </div>
      )}

      {/* 선택된 모델에 대한 모달 */}
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

export default AiModelSlide;

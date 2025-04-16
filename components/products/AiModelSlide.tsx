"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import useUser from "@/app/hooks/useUser";
import { useQuery } from "@apollo/client";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";
import { Product } from "@/app/gql/graphql";
import { FiEye, FiLoader, FiBox } from "react-icons/fi";
import axios from "axios";
import ResultModal from "./AiModel/ResultModal";

// Swiper 스타일 가져오기
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface S3Model {
  key: string;
  url: string;
  title: string;
  lastModified: Date | string;
}

const AiModelSlide: React.FC = () => {
  const [aiModels, setAiModels] = useState<Product[]>([]);
  const [s3Models, setS3Models] = useState<S3Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<S3Model | null>(null);
  const [showModal, setShowModal] = useState(false);

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

    // GraphQL 데이터 새로고침
    refetch();

    // S3에서 직접 모델 가져오기
    await fetchS3Models();

    setLoading(false);
  };

  // 컴포넌트 마운트 시와 userId 변경 시 데이터 가져오기
  useEffect(() => {
    if (userId) {
      fetchAllModels();
    }
  }, [userId]);

  // S3에서 직접 모델 파일 목록 가져오기
  const fetchS3Models = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("S3 모델 가져오기 요청:", `/api/ai-models?userId=${userId}`);

      // S3 경로를 직접 확인하여 사용자의 모델 목록 가져오기
      const response = await axios.get(`/api/ai-models?userId=${userId}`);

      console.log("API 응답:", response.data);

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

      // 샘플 데이터 사용 제거
      setError("모델 로드 중 오류가 발생했습니다. 새로고침을 시도해보세요.");
    } finally {
      setLoading(false);
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

  // 로딩 중 표시
  if (loading) {
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

  // GraphQL과 S3에서 모델이 모두 없는 경우
  const hasModels = aiModels.length > 0 || s3Models.length > 0;

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
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {/* S3에서 직접 가져온 모델 먼저 표시 */}
        {s3Models.map((model) => (
          <SwiperSlide key={`s3-${model.key}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col">
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
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-medium text-gray-900 truncate">
                  {model.title || "AI 3D 모델"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {typeof model.lastModified === "string"
                    ? new Date(model.lastModified).toLocaleDateString()
                    : model.lastModified?.toLocaleDateString?.() ||
                      "최근 생성됨"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* GraphQL에서 가져온 기존 모델 표시 */}
        {aiModels.map((model) => (
          <SwiperSlide key={`gql-${model.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col">
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
                  >
                    <FiEye size={20} />
                  </Link>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-medium text-gray-900 truncate">
                  {model.title || "AI 3D 모델"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(model.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-4 text-right">
        <button
          onClick={fetchAllModels}
          className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
        >
          새로고침
        </button>
      </div>

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

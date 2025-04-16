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
import { FiEye } from "react-icons/fi";

// Swiper 스타일 가져오기
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AiModelSlide: React.FC = () => {
  const [aiModels, setAiModels] = useState<Product[]>([]);
  const { data: userData } = useUser();
  const userId = userData?.getMyInfo?.id;

  // 모든 상품을 가져온 후 AI 3D 모델만 필터링
  const { data, loading } = useQuery(ALL_PRODUCT_QUERY, {
    variables: { offset: 0 },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.allProduct) {
      const products = data.allProduct.filter(
        (product: any): product is Product =>
          product !== null &&
          product.original_photo &&
          product.original_photo[0] &&
          product.original_photo[0].includes("AI_3D_Models")
      );
      setAiModels(products);
    }
  }, [data]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;

  if (aiModels.length === 0) {
    return (
      <div className="text-center py-10">
        <p>저장된 AI 3D 모델이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-600">
          {userId
            ? "AI 3D 모델을 생성하고 저장해보세요!"
            : "로그인하시면 AI 3D 모델을 생성할 수 있습니다."}
        </p>
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
        {aiModels.map((model) => (
          <SwiperSlide key={model.id}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md h-64 flex flex-col">
              <div className="relative h-40 bg-gray-100">
                {model.original_photo && model.original_photo[0] && (
                  <Image
                    src={model.original_photo[0]}
                    alt={model.title}
                    fill
                    className="object-cover"
                  />
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
                  {model.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(model.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AiModelSlide;

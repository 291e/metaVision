"use client";

import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";
import "@/app/globals.css";
// Import required modules
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";
import {
  AllProductQuery,
  AllProductQueryVariables,
  Product,
} from "@/app/gql/graphql";
import Image from "next/image";

const Slide: React.FC = () => {
  // Apollo Client의 useQuery 훅을 사용하여 데이터 패칭
  const { data, loading, error } = useQuery<
    AllProductQuery,
    AllProductQueryVariables
  >(ALL_PRODUCT_QUERY, {
    variables: { offset: 0 }, // 모든 상품을 가져오기
    fetchPolicy: "network-only", // 항상 네트워크에서 최신 데이터 가져오기
  });

  // 로딩 상태 처리 제거 (사용자 요청)
  // if (loading) return <div>로딩 중...</div>;

  // 에러 상태 처리
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  // 데이터가 없거나 비어있는 경우 처리
  if (!data || !data.allProduct || data.allProduct.length === 0)
    return <div>상품이 없습니다.</div>;

  // 최신 7개의 상품 데이터 (null 값 필터링 후 슬라이싱)
  const latestProducts: Product[] = data.allProduct
    .filter((product): product is Product => product !== null)
    .slice(0, 7);
  return (
    <Swiper
      loop={true}
      autoplay={{ delay: 5000 }}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        600: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1400: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination, Autoplay]}
    >
      {latestProducts.map((product) => (
        <SwiperSlide className="pb-12 px-4" key={product.id}>
          <HoverableProduct product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

// HoverableProduct 컴포넌트 정의
const HoverableProduct: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="flex flex-col justify-center rounded-2xl items-center text-black mt-12 shadow-lg py-4">
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
          <p>상품의 이미지를 불러올 수 없습니다.</p>
        )}
      </Link>

      {/* 상품 상세 페이지 링크 */}
      <div className="my-4">
        <Link
          className="underline-offset-8 underline text-black hover:underline-offset-4 transition-all"
          href={`/meta360/${product.id}`}
        >
          보러가기
        </Link>
      </div>
    </div>
  );
};
export default Slide;

"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { useQuery } from "@apollo/client";

import {
  GetMyProductQuery,
  GetMyProductQueryVariables,
  Product,
} from "@/app/gql/graphql";
import Image from "next/image";
import { MY_PRODUCT_QUERY } from "@/app/api/product/query";

const MyAssetsSlide: React.FC = () => {
  const { data, loading, error } = useQuery<
    GetMyProductQuery,
    GetMyProductQueryVariables
  >(MY_PRODUCT_QUERY, {
    variables: { offset: 0 },
    fetchPolicy: "network-only",
  });

  if (error) return <div>에러가 발생했습니다: {error.message}</div>;
  if (!data || !data.getMyProduct || data.getMyProduct.length === 0)
    return (
      <div className="flex w-full justify-center mt-12">
        나의 자산이 없습니다.
      </div>
    );

  const myProducts: Product[] = data.getMyProduct
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
      pagination={{ clickable: true }}
      modules={[Pagination, Autoplay]}
    >
      {myProducts.map((product) => (
        <SwiperSlide className="pb-12 px-4" key={product.id}>
          <HoverableProduct product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

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

export default MyAssetsSlide;

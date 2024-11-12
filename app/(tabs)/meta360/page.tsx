"use client";

import type { Product } from "@/app/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ALL_PRODUCT_QUERY } from "../../api/product/query";
import { GET_MY_QUERY } from "../../api/user/query";
import { DELETE_PRODUCT_MUTATION } from "@/app/api/product/mutation";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  DeleteProductMutation,
  DeleteProductMutationVariables,
  GetMyInfoQuery,
  AllProductQuery,
  AllProductQueryVariables,
} from "@/app/gql/graphql";
import banner from "@/public/blue.png";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export default function Product() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 페이지 번호 가져오기
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLastPage, setIsLastPage] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const productListRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<GetMyInfoQuery>(GET_MY_QUERY);

  const { data, loading, error, refetch } = useQuery<
    AllProductQuery,
    AllProductQueryVariables
  >(ALL_PRODUCT_QUERY, {
    variables: { offset: (page - 1) * 16 },
    fetchPolicy: "cache-and-network",
  });

  const [deleteProductMutation] = useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DELETE_PRODUCT_MUTATION, {
    onCompleted: async (data) => {
      if (data.deleteProduct.success) {
        console.log("Product deleted");
        await refetch();
      } else {
        console.error("Failed to delete product:", data.deleteProduct.message);
      }
    },
  });

  useEffect(() => {
    if (data?.allProduct) {
      const fetchedProducts = data.allProduct.filter(
        (product): product is Product => product !== null
      );

      setIsLastPage(fetchedProducts.length < 16);
      setProducts(fetchedProducts);
    }
  }, [data?.allProduct]);

  useEffect(() => {
    refetch();
  }, [isLoggedIn, page, refetch]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }, [page, router]);

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    setIsLastPage(false);
  };

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProductMutation({ variables: { id: selectedProductId } });
      setShowConfirm(false);
      setSelectedProductId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedProductId(null);
  };

  if (loading || userLoading) {
    return <h1>로딩 중...</h1>;
  }

  if (error || userError) {
    return <h1>에러 발생: {error?.message || userError?.message}</h1>;
  }

  return (
    <div className="relative h-full">
      <div className="flex justify-center">
        <Image src={banner} alt="Banner" width={0} height={0} priority />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-lg mb-4">정말 삭제하실 겁니까?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
                onClick={handleCancelDelete}
              >
                N
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleConfirmDelete}
              >
                Y
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={productListRef}
        className="p-5 grid grid-cols-4 max-2xl:grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 transition-all transform items-center gap-5"
      >
        {products.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            상품이 없습니다.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="relative flex flex-col gap-5 w-full rounded-2xl p-2 shadow-md"
            >
              {userData?.getMyInfo?.isAdmin && (
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="absolute top-2 right-2 z-10 w-10 h-10 bg-meta rounded-md flex justify-center items-center"
                  aria-label={`Delete ${product.title.substring(0, 10)}`}
                >
                  <TrashIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5 text-white" />
                </button>
              )}
              <Link
                href={`/meta360/${product.id}`}
                className="relative size-60 rounded-md mx-auto overflow-hidden"
              >
                {product.original_photo && product.original_photo[0] && (
                  <Image
                    className="object-cover h-full"
                    width={360}
                    height={640}
                    src={product.original_photo[0]}
                    alt={product.title.substring(0, 10)}
                    priority
                  />
                )}
              </Link>
              <div className="flex justify-center text-neutral-800">
                <span className="text-lg">
                  {product.title.substring(0, 10)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className={`my-2 px-4 py-2 rounded hover:scale-110 transition-transform ${
            isLastPage
              ? "bg-gray-200 text-gray-800 cursor-not-allowed"
              : "bg-meta text-white"
          }`}
          onClick={() => !isLastPage && handlePageChange(page + 1)}
          disabled={isLastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// pages/admin.tsx
"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetMyInfoQuery,
  AllProductQuery,
  GetAllUsersQuery,
} from "@/app/gql/graphql";
import { GET_MY_QUERY, GET_ALL_USERS } from "@/app/api/user/query";
import {
  DELETE_PRODUCT_MUTATION,
  EDIT_PRODUCT_MUTATION,
} from "@/app/api/product/mutation";
import Image from "next/image";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import useUser from "@/app/hooks/useUser";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";

export default function AdminPage() {
  const { data: userData, loading: userLoading, error: userError } = useUser();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  // 전체 사용자 조회 쿼리
  const { data: allUsersData, loading: usersLoading } =
    useQuery<GetAllUsersQuery>(GET_ALL_USERS, {
      variables: { offset: 0 },
      fetchPolicy: "network-only",
    });

  // 상품 리스트 가져오기
  const {
    data: productData,
    loading: productLoading,
    refetch,
  } = useQuery<AllProductQuery>(ALL_PRODUCT_QUERY, {
    variables: { offset: 0 },
    fetchPolicy: "network-only",
  });

  // 상품 삭제 뮤테이션
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsDeleteConfirmOpen(false);
      setSelectedProductId(null);
    },
  });

  // 상품 수정 뮤테이션
  const [editProductMutation] = useMutation(EDIT_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      setEditingProductId(null); // 수정 완료 후 수정 모드 해제
    },
  });

  const handleDeleteProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteConfirmOpen(true); // 삭제 확인 모달 열기
  };

  const confirmDeleteProduct = () => {
    if (selectedProductId) {
      deleteProductMutation({ variables: { id: selectedProductId } });
    }
  };

  const handleEditProduct = (productId: string, title: string) => {
    setEditingProductId(productId);
    setEditTitle(title);
  };

  const saveEditedProduct = () => {
    if (editingProductId && editTitle.trim()) {
      editProductMutation({
        variables: { id: editingProductId, title: editTitle },
      });
    }
  };

  if (userLoading || productLoading || usersLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* 사용자 리스트 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User List</h2>
        {allUsersData?.getAllUsers?.length ? (
          <div className="grid grid-cols-2 gap-4">
            {allUsersData.getAllUsers.map((user) => (
              <div key={user?.id} className="border p-4 rounded-lg shadow-md">
                <p>Email: {user?.email}</p>
                <p>Admin: {user?.isAdmin ? "Yes" : "No"}</p>
                <p>Subscribed: {user?.isSubscribed ? "Yes" : "No"}</p>
                {/* 추가적인 유저 정보 표시 */}
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* 상품 리스트 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        {productData?.allProduct?.length ? (
          <div className="grid grid-cols-2 gap-4">
            {productData.allProduct.map((product) => (
              <div
                key={product?.id}
                className="border p-4 rounded-lg shadow-md"
              >
                {product?.original_photo && product?.original_photo[0] && (
                  <Image
                    src={product.original_photo[0]}
                    alt={product.title}
                    width={150}
                    height={150}
                    className="rounded mb-4 object-cover"
                  />
                )}
                {editingProductId === product?.id ? (
                  <div>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border p-1 rounded mb-2 w-full"
                    />
                    <button
                      onClick={saveEditedProduct}
                      className="bg-blue-500 text-white p-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProductId(null)}
                      className="bg-gray-300 p-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold mb-2">{product?.title}</h3>
                    <button
                      onClick={() =>
                        product?.id &&
                        product?.title &&
                        handleEditProduct(product.id, product.title)
                      }
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5 inline" /> Edit
                    </button>
                    <button
                      onClick={() =>
                        product?.id && handleDeleteProduct(product.id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5 inline" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <p className="text-lg mb-4">정말 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                N
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Y
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

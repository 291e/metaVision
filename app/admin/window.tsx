"use client";

import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetMyInfoQuery,
  AllProductQuery,
  GetAllUsersQuery,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  EditProductMutation,
  EditProductMutationVariables,
} from "@/app/gql/graphql";
import { GET_ALL_USERS } from "@/app/api/user/query";

import Image from "next/image";
import {
  TrashIcon,
  PencilIcon,
  CubeIcon,
  UserIcon,
  Cog8ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import useUser from "@/app/hooks/useUser";
import { ALL_PRODUCT_QUERY } from "@/app/api/product/query";
import metaVision from "@/public/admin/Frame 14.svg";
import {
  DELETE_PRODUCT_MUTATION,
  EDIT_PRODUCT_MUTATION,
} from "../api/product/mutation";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { logOut } from "../store/slices/loginSlice";

import { useDispatch, useSelector } from "react-redux";

const menuItems = [
  { id: "products", label: "상품 관리", icon: <CubeIcon className="size-6" /> },
  { id: "users", label: "회원 관리", icon: <UserIcon className="size-6" /> },
  { id: "settings", label: "설정", icon: <Cog8ToothIcon className="size-6" /> },
];

// 날짜 포맷 함수
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function AdminPageWindow() {
  const { data: userData, loading: userLoading, error: userError } = useUser();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedMenu, setSelectedMenu] = useState<string>("products"); // 기본 선택
  const [editOpen, setEditOpen] = useState(false);
  const dispatch = useDispatch();

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
  const [deleteProductMutation] = useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DELETE_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      if (data.deleteProduct.success) {
        alert("상품이 성공적으로 삭제되었습니다.");
        refetch(); // 상품 목록 갱신
      } else {
        alert(`삭제 실패: ${data.deleteProduct.message}`);
      }
    },
    onError: (error) => {
      console.error("상품 삭제 실패:", error.message);
      alert("삭제 중 문제가 발생했습니다.");
    },
  });

  // 상품 수정 뮤테이션
  const [editProductMutation] = useMutation<
    EditProductMutation,
    EditProductMutationVariables
  >(EDIT_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      setEditingProductId(null); // 수정 완료 후 수정 모드 해제
    },
  });

  const handleDeleteProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteConfirmOpen(true); // 삭제 확인 모달 열기
  };

  const confirmDeleteProduct = async () => {
    if (selectedProductId) {
      try {
        const { data } = await deleteProductMutation({
          variables: { id: selectedProductId },
        });
        if (data?.deleteProduct?.success) {
          alert("상품이 삭제되었습니다.");
          setIsDeleteConfirmOpen(false);
          setSelectedProductId(null);
          refetch(); // UI 갱신
        } else {
          alert(`삭제 실패: ${data?.deleteProduct?.message}`);
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제 중 문제가 발생했습니다.");
      }
    }
  };

  const handleEditProduct = (productId: string, title: string) => {
    setEditingProductId(productId);
    setEditTitle(title);
  };

  const saveEditedProduct = async () => {
    if (editingProductId && editTitle.trim()) {
      try {
        const { data } = await editProductMutation({
          variables: {
            id: editingProductId,
            title: editTitle,
          },
        });
        if (data?.editProduct?.success) {
          alert("상품이 수정되었습니다.");
          refetch();
          setEditingProductId(null);
          setEditTitle("");
        } else {
          alert(`수정 실패: ${data?.editProduct?.message}`);
        }
      } catch (error) {
        console.error("수정 중 오류 발생:");
        alert("수정 중 문제가 발생했습니다.");
      }
    } else {
      alert("제목을 입력해주세요.");
    }
  };

  const handleLogout = useCallback(() => {
    dispatch(logOut());
    // 홈 페이지로 새로고침하며 이동
    window.location.href = "/";
  }, [dispatch]);

  if (userLoading || productLoading || usersLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;

  return (
    <>
      <div className="justify-between hidden md:flex">
        <div className="flex">
          <div className="max-w-[384px] w-full bg-slate-200 p-4 px-6">
            <Image src={metaVision} alt="meta" width={0} height={0} />

            <div className="flex flex-col justify-center items-start mt-8 gap-4 lg:w-[336px] md:w-[236px] w-[136px]">
              {menuItems.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu.id)} // 클릭 시 선택 상태 업데이트
                  className={`flex items-center gap-2 p-2 rounded-md w-full max-w-[336px] cursor-pointer transition-all ${
                    selectedMenu === menu.id
                      ? "bg-[#00498C1A] text-[#00498c] font-semibold" // 선택된 경우 스타일
                      : "bg-transparent text-[#777777]" // 선택되지 않은 경우 스타일
                  }`}
                >
                  <div
                    className={`${
                      selectedMenu === menu.id
                        ? "text-[#00498C]"
                        : "text-[#777777]"
                    }`}
                  >
                    {menu.icon}
                  </div>
                  <span className="text-sm md:text-base">{menu.label}</span>
                </div>
              ))}
            </div>

            <div className="fixed bottom-0 flex items-center pb-4 justify-between lg:w-[336px] md:w-[236px] w-[136px]">
              <div className="flex gap-1  items-center">
                <div className="bg-slate-700 size-8 rounded-full" />
                <div className="font-semibold">
                  {userData?.getMyInfo?.email}
                </div>
              </div>

              <button onClick={handleLogout}>
                <ArrowRightStartOnRectangleIcon className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 선택된 메뉴에 따른 콘텐츠 렌더링 */}
        <div className="flex flex-col items-center w-full gap-2 px-8">
          {selectedMenu === "users" && (
            <div className="w-full my-4 h-screen">
              <h2 className="text-2xl font-semibold mb-4">User List</h2>
              {allUsersData?.getAllUsers?.length ? (
                <div className="flex flex-col border border-gray-300 divide-y">
                  {/* 첫 번째 행 (헤더) */}
                  <div className="grid grid-cols-4 bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 text-left items-center">
                    <span>유저명</span>
                    <span>어드민 유무</span>
                    <span>구독 여부</span>
                    <span>생성일</span>
                  </div>
                  {/* 데이터 행 */}
                  {allUsersData.getAllUsers.map((user) => (
                    <div
                      key={user?.id}
                      className="grid grid-cols-4 px-4 py-2 text-sm items-center text-left"
                      style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
                    >
                      <span className="truncate">{user?.email}</span>
                      <span>{user?.isAdmin ? "Yes" : "No"}</span>
                      <span>{user?.isSubscribed ? "Yes" : "No"}</span>
                      <span>{formatDate(Number(user?.createdAt))}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          )}

          {selectedMenu === "products" && (
            <div className="my-4 w-full">
              <div className="text-2xl font-semibold mb-4 flex justify-between items-center">
                <span>Product List</span>
                <Link href={"/"}>
                  <HomeIcon className="size-6" />
                </Link>
              </div>
              {productData?.allProduct?.length ? (
                <div className="flex flex-col w-full justify-center">
                  {productData.allProduct.map((product) => (
                    <div
                      key={product?.id}
                      className="border-b border-x first:border-t p-4 even:bg-[#EFF3F6] flex gap-4"
                    >
                      {product?.original_photo &&
                        product?.original_photo[0] && (
                          <div className="flex flex-col gap-2">
                            <div className="text-[#777777]">이미지</div>
                            <Image
                              src={product.original_photo[0]}
                              alt={product.title}
                              width={100}
                              height={100}
                              className="rounded mb-4 size-[100px]"
                            />
                          </div>
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
                        <div className="flex items-center gap-4 h-full">
                          <div className="flex flex-col gap-2">
                            <div className="text-[#777777]">제목</div>
                            <div className="text-lg font-bold mb-2">
                              {product?.title}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="text-[#777777]">관리</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  product?.id &&
                                  product?.title &&
                                  handleEditProduct(product.id, product.title)
                                }
                                className="text-blue-500 hover:text-blue-700 w-[60px] h-[30px] bg-[#E5EAEE] rounded-md"
                              >
                                수정
                              </button>
                              <button
                                onClick={() =>
                                  product?.id && handleDeleteProduct(product.id)
                                }
                                className="text-red-500 hover:text-red-700 w-[60px] h-[30px] bg-[#E5EAEE] rounded-md"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No products found.</p>
              )}
            </div>
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
    </>
  );
}

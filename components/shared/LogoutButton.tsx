"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { logOut } from "@/app/store/slices/loginSlice";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";

export default function LogoutButton() {
  const router = useRouter();
  const client = useApolloClient();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = useCallback(async () => {
    try {
      // Redux를 통해 로그아웃 처리
      dispatch(logOut());

      // Apollo Client의 캐시를 초기화
      await client.clearStore();

      // 페이지를 새로고침하면서 홈 페이지로 이동
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [client, dispatch]);

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-transform transform hover:scale-105 duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
      aria-label="로그아웃"
    >
      <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2" />
      로그아웃
    </button>
  );
}

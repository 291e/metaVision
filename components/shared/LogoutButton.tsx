// components/shared/LogoutButton.tsx

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import { logUserOut } from "@/lib/apolloClient"; // apolloClient.ts의 경로에 맞게 수정
import {
  ArrowRightOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function LogoutButton() {
  const router = useRouter();
  const client = useApolloClient();

  const handleLogout = useCallback(async () => {
    try {
      // 로그아웃 처리: 로컬 스토리지에서 토큰 제거, Reactive Variables 업데이트, 캐시 클리어
      await logUserOut(client);

      // 페이지를 새로고침하면서 로그인 페이지로 이동
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      // 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [client]);

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

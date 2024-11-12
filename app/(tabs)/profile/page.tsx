"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import useUser from "@/app/hooks/useUser";
import LogoutButton from "@/components/shared/LogoutButton";
import {
  UserCircleIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { RootState } from "@/app/store/store";

export default function Profile() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn); // Redux에서 로그인 상태 가져오기
  const { data, loading, error } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        에러 발생: {error.message}
      </div>
    );
  if (!data?.getMyInfo)
    return (
      <div className="text-gray-500 text-center mt-10">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );

  const user = data.getMyInfo;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        {/* 사용자 정보 카드 */}
        <div className="flex flex-col items-center">
          <UserCircleIcon className="w-24 h-24 text-meta mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {user.email}
          </h2>
          <p className="text-gray-600">ID: {user.id}</p>
        </div>

        {/* 사용자 세부 정보 */}
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <EnvelopeIcon className="w-5 h-5 text-meta mr-3" />
            <span className="text-gray-700">
              {user.email ? user.email : "이메일이 존재하지 않습니다."}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-meta mr-3" />
            <span
              className={`text-gray-700 ${
                user.isAdmin ? "text-green-600" : "text-red-600"
              }`}
            >
              관리자 여부: {user.isAdmin ? "예" : "아니오"}
            </span>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

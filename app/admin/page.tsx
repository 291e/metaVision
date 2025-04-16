"use client";

import AdminPageMobile from "./mobile";
import AdminPageWindow from "./window";
import useUser from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const { data, loading, error } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // 로딩이 완료되고 데이터가 있는 경우
    if (!loading && data) {
      if (!data.getMyInfo || !data.getMyInfo.isAdmin) {
        console.log("관리자 권한이 없습니다. 메인 페이지로 이동합니다.");
        router.push("/");
      } else {
        console.log("관리자 권한 확인 완료:", data.getMyInfo.email);
        setIsAdmin(true);
      }
    }

    // 로그인되지 않았거나 오류가 발생한 경우
    if (!loading && (error || !data?.getMyInfo)) {
      console.log("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [data, loading, error, router]);

  // 로딩 중이거나 권한 확인 중일 때 로딩 상태 표시
  if (loading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  // 관리자 권한이 확인된 경우에만 관리자 페이지 표시
  return (
    <>
      <AdminPageWindow />
      <AdminPageMobile />
    </>
  );
}

"use client";

import { DELETE_ACCOUNT_MUTATION } from "@/app/api/user/mutation";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT_MUTATION);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    const email = prompt("계정 삭제를 위해 이메일을 입력하세요.");
    if (!email) return;
    const password = prompt("비밀번호를 입력하세요.");
    if (!password) return;
    setError(null);
    setSuccess(null);
    try {
      const { data } = await deleteAccount({ variables: { email, password } });
      if (data?.deleteAccount?.success) {
        setSuccess("계정이 성공적으로 삭제되었습니다.");
        // 로그아웃 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setError(data?.deleteAccount?.message || "계정 삭제에 실패했습니다.");
      }
    } catch (e: any) {
      setError(e.message || "계정 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "삭제 중..." : "계정 삭제"}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from "../../gql/graphql";
import { CREATE_ACCOUNT_MUTATION } from "../../api/user/mutation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type SignUpData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUpPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignUpData>();

  const [createAccount, { loading: createLoading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION);

  const clearSignUpError = (type: keyof SignUpData) => clearErrors(type);

  const onValid = async (data: SignUpData) => {
    if (data.password !== data.passwordConfirm) {
      return setError("passwordConfirm", {
        message: "비밀번호가 일치하지 않습니다",
      });
    }

    const variables = {
      email: data.email,
      phone: "",
      password: data.password,
    };

    try {
      const { data: createData } = await createAccount({ variables });

      if (createData?.createAccount.success) {
        router.push("/login");
      } else {
        setError("root", {
          message:
            createData?.createAccount.message || "회원가입에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      setError("root", { message: "회원가입 중 오류가 발생했습니다." });
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6 mt-20 border-2 rounded-2xl border-neutral-200 shadow-md bg-neutral-700 text-white max-w-screen-sm w-full">
      {/* 로고 */}
      <div className="flex justify-center">
        <Image
          src="/main/metabank360.svg"
          alt="MetaBank360 Logo"
          width={192}
          height={36}
        />
      </div>

      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            {...register("email", {
              required: "필수 입력 항목입니다",
            })}
            onFocus={() => clearSignUpError("email")}
            className="input-meta"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">비밀번호</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="숫자 4자리만 입력해주세요"
              {...register("password", { required: "필수 입력 항목입니다" })}
              onFocus={() => clearSignUpError("password")}
              className="input-meta"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPw ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">비밀번호 확인</label>
          <div className="relative">
            <input
              type={showPwConfirm ? "text" : "password"}
              placeholder="비밀번호를 확인해주세요"
              {...register("passwordConfirm", {
                required: "필수 입력 항목입니다",
              })}
              onFocus={() => clearSignUpError("passwordConfirm")}
              className="input-meta"
            />
            <button
              type="button"
              onClick={() => setShowPwConfirm(!showPwConfirm)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPwConfirm ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-meta disabled:bg-gray-500"
          disabled={createLoading}
        >
          {createLoading ? "회원가입 중..." : "회원가입"}
        </button>
        {errors.root && (
          <p className="text-red-500 text-sm mt-1 text-center">
            {errors.root.message}
          </p>
        )}
      </form>

      <p className="text-center text-sm text-neutral-300">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-meta hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}

// Login.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../../gql/graphql";
import { LOGIN_MUTATION } from "../../api/user/mutation";
import { useDispatch } from "react-redux";
import { logIn } from "@/app/store/slices/loginSlice";

type LogInData = {
  username: string;
  password: string;
  result: {
    message: string;
  };
};

export default function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LogInData>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    register("username", {
      required: "이메일을 입력해주세요",
      //   pattern: {
      //     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      //     message: "올바른 이메일 주소를 입력해주세요.",
      //   },
    });
    register("password", {
      required: "비밀번호를 입력해주세요",
      validate: {
        length: (value) =>
          (value.length === 4 && /^\d+$/.test(value)) ||
          "비밀번호는 4자리 숫자여야 합니다.",
      },
    });
  }, [register]);

  const clearLogInError = () => {
    clearErrors("username");
    setErrorMessage(null); // 에러 메시지 초기화
  };

  const [loginMutation, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      const {
        login: { success, token, message },
      } = data;
      if (success && token) {
        dispatch(logIn(token)); // Redux 상태에 토큰 저장
        router.push("/");
      } else {
        setErrorMessage(message || "로그인에 실패했습니다.");
      }
    },
  });

  const onValid = (data: LogInData) => {
    if (!loading) {
      setErrorMessage(null); // 폼 제출 시 에러 메시지 초기화
      loginMutation({
        variables: {
          email: data.username,
          password: data.password,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6 border-2 rounded-2xl border-neutral-200 shadow-md bg-neutral-700 text-white w-full max-w-screen-sm mb-20">
      <div className="flex flex-col gap-2 font-medium ">
        <h1 className="text-2xl">Metabank360</h1>
        <h2 className="text-xl">
          이메일과 비밀번호를 입력해 로그인을 진행하세요!
        </h2>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onValid)}>
        <label className="text-sm font-medium text-neutral-300">
          이메일을 입력해주세요
        </label>
        <div>
          <input
            {...register("username")}
            placeholder="이메일을 입력해주세요"
            onFocus={clearLogInError}
            className="input-meta"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="relative flex flex-col justify-center">
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="비밀번호 4자리를 입력해주세요"
            className="mt-2 bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-4 transition ring-meta focus:ring-meta border-none placeholder:text-neutral-300 text-lg pb-3"
          />
          <button
            type="button"
            onClick={() => setShowPw((prev) => !prev)}
            className="absolute right-0 top-[14px] px-2 text-gray-500"
          >
            {showPw ? "숨기기" : "보이기"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 서버 에러 메시지 표시 */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-meta h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
          {loading ? "로딩 중" : "Log In"}
        </button>
      </form>
    </div>
  );
}

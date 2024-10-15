// Login.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../../gql/graphql";
import { LOGIN_MUTATION } from "../../api/user/mutation";
import { logUserIn } from "@/lib/apolloClient";
import SocialLogin from "@/components/auth/social-login";

type LogInData = {
	email?: string;
	phone?: string;
	password: string;
};

export default function LogIn() {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
		setError,
		clearErrors,
		watch,
	} = useForm<LogInData>();
	const router = useRouter();
	const [showPw, setShowPw] = useState(false);
	const [usePhone, setUsePhone] = useState(true);

	const setEmailClick = () => setUsePhone(false);
	const setPhoneClick = () => setUsePhone(true);

	useEffect(() => {
		register("phone");
		register("email");
		register("password", {
			required: "비밀번호를 입력해주세요",
			validate: {
				length: (value) => (value.length === 4 && /^\d+$/.test(value)) || "비밀번호는 4자리 숫자여야 합니다.",
			},
		});
	}, [register]);

	const clearLogInError = () => {
		clearErrors("email");
		clearErrors("phone");
	};

	const [loginMutation, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
		onCompleted: async (data) => {
			const {
				login: { success, token, message },
			} = data;
			if (success && token) {
				logUserIn(token);
				router.push("/");
			} else if (message) {
				setError("phone", { message: message });
			}
		},
	});

	const onValid = (data: LogInData) => {
		if (!loading) {
			if (usePhone) {
				loginMutation({
					variables: {
						phone: data.phone,
						password: data.password,
					},
				});
			} else {
				loginMutation({
					variables: {
						email: data.email,
						password: data.password,
					},
				});
			}
		}
	};

	return (
		<div className="flex flex-col gap-10 py-8 px-6 border-2 rounded-2xl border-neutral-200 shadow-md bg-neutral-700 text-white w-full max-w-screen-sm mt-20">
			<div className="flex flex-col gap-2 *:font-medium ">
				<h1 className="text-2xl">Metabank360</h1>
				<h2 className="text-xl">이메일과 비밀번호를 입력해 로그인을 진행하세요!</h2>
			</div>

			<div className="grid w-full grid-cols-2 ">
				<button
					className={`pb-4 border-b-2 font-semibold ${
						usePhone ? "border-meta text-meta" : "border-neutral-300 text-neutral-300"
					}`}
					onClick={setPhoneClick}>
					Phone
				</button>
				<button
					className={`pb-4 border-b-2 font-semibold ${
						!usePhone ? "border-meta text-meta" : "border-neutral-300 text-neutral-300"
					}`}
					onClick={setEmailClick}>
					Email
				</button>
			</div>

			<form className="flex flex-col gap-3" onSubmit={handleSubmit(onValid)}>
				<label className="text-sm font-medium text-neutral-300">
					{usePhone ? "전화번호를 입력해주세요" : "이메일을 입력해주세요"}
				</label>
				<div>
					<div className="flex flex-col gap-2">
						<input
							{...register(usePhone ? "phone" : "email", { required: true })}
							placeholder={usePhone ? "전화번호를 입력해주세요" : "이메일을 입력해주세요"}
							onFocus={clearLogInError}
							className="input-meta"
						/>
					</div>
					{usePhone && errors.phone && <p className="text-red-500 text-sm mt-1">전화번호를 입력해주세요</p>}
					{!usePhone && errors.email && <p className="text-red-500 text-sm mt-1">이메일을 입력해주세요</p>}
				</div>
				<div className="relative flex items-center">
					<input
						{...register("password", { required: "비밀번호를 입력해주세요" })}
						type={showPw ? "text" : "password"}
						placeholder="비밀번호 4자리를 입력해주세요"
						className="mt-2 bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-4 transition ring-meta focus:ring-meta border-none placeholder:text-neutral-300 text-lg pb-3"
					/>
					<button
						type="button"
						onClick={() => setShowPw((prev) => !prev)}
						className="absolute right-0 top-[14px] px-2 text-gray-500">
						{showPw ? "숨기기" : "보이기"}
					</button>
					{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
				</div>
				<button
					type="submit"
					disabled={loading}
					className="btn-meta h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed">
					{loading ? "로딩 중" : "Log In"}
				</button>
			</form>

			<SocialLogin />
		</div>
	);
}

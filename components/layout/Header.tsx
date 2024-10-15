"use client";

import Image from "next/image";
import meta360 from "@/public/main/metabank360.svg";
import metabank from "@/public/main/main_metabank_white2.png";
import metavision from "@/public/main/realmeta.svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Bars2Icon,
	UserCircleIcon,
	UserIcon,
	UserPlusIcon,
	XMarkIcon,
	ArrowRightOnRectangleIcon,
	PlusIcon,
	MinusIcon, // 로그아웃 아이콘
} from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { isLoggedInVar, logUserOut } from "@/lib/apolloClient";
import { useApolloClient, useReactiveVar } from "@apollo/client";

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const client = useApolloClient();

	// Reactive Variable 사용
	const currentIsLoggedIn = useReactiveVar(isLoggedInVar);

	const handleMenuToggle = () => {
		setMenuOpen(!menuOpen);
	};

	const handleUserMenuToggle = () => {
		setUserMenuOpen(!userMenuOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setMenuOpen(false);
		}
	};

	const handleLogout = useCallback(async () => {
		try {
			await logUserOut(client);
			// 홈 페이지로 완전히 새로고침하면서 이동
			window.location.href = "/";
		} catch (error) {
			console.error("로그아웃 중 오류 발생:", error);
			// 사용자에게 오류 메시지를 표시하는 로직 추가 가능
		}
	}, [client]);

	useEffect(() => {
		if (menuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			// 스크롤 비활성화
			document.body.style.overflow = "hidden";
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			// 스크롤 활성화
			document.body.style.overflow = "";
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	useEffect(() => {
		// 로그인 상태 구독
		const unsubscribe = isLoggedInVar.onNextChange((value) => {
			setIsLoggedIn(value);
		});

		// 초기 로그인 상태 설정
		setIsLoggedIn(isLoggedInVar());

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<div className="z-50 fixed w-full bg-meta py-7 max-md:navbar transition-all">
			{/* 데스크톱 메뉴 */}
			<div className="flex justify-center md:max-w-[870px] lg:max-w-[1100px] xl:max-w-[1300px] px-10 mx-auto max-md:hidden">
				<div className="flex items-center justify-between w-full md:text-base lg:text-lg xl:text-xl text-white transition-all">
					<Link className="max-w-40 max-h-10 max-lg:max-w-32" href="/">
						<Image
							src={meta360}
							alt="logo"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</Link>
					<Link className="hover:text-neutral-400" href="/meta360">
						<span>meta vision</span>
					</Link>
					<Link className="hover:text-neutral-400" href="/solution">
						<span>solution</span>
					</Link>
					<Link className="hover:text-neutral-400" href="/pricing">
						<span>pricing</span>
					</Link>
					<Link className="hover:text-neutral-400" href="/help">
						<span>help</span>
					</Link>
					<Link className="hover:text-neutral-400" href="/partner">
						<span>partner</span>
					</Link>

					<div className="flex items-center gap-10 max-lg:gap-4">
						<Link className="max-w-36 max-h-10 max-lg:max-w-24" href="https://www.metabank3d.com/">
							<Image
								src={metabank}
								alt="logo"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</Link>
						<Link className="max-w-32 max-h-10 max-lg:max-w-20" href="https://www.realmeta3d.com/">
							<Image
								src={metavision}
								alt="logo"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</Link>
					</div>
					<div className="flex gap-5 max-lg:gap-2">
						{!currentIsLoggedIn ? (
							<>
								<Link href="/login">
									<UserIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
								</Link>
								<Link href="/create-account">
									<UserPlusIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
								</Link>
							</>
						) : (
							<>
								<Link href="/profile">
									<UserCircleIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
								</Link>
								<button onClick={handleLogout}>
									<ArrowRightOnRectangleIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* 모바일 메뉴 */}
			<div className="w-full h-16 md:hidden" ref={menuRef}>
				<div className="flex items-center justify-between w-full px-4">
					<button
						onClick={handleMenuToggle}
						className={`text-white hover:bg-meta p-2 rounded-md transition-colors duration-200`}>
						<Bars2Icon className="size-11" />
					</button>
					<Link href="/">
						<Image
							src={metavision}
							alt="logo"
							className="w-32 h-auto"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</Link>
				</div>

				{menuOpen && (
					<>
						{/* 오버레이 */}
						<div
							className="fixed inset-0 bg-black opacity-50 z-40"
							onClick={() => setMenuOpen(false)}></div>

						{/* 메뉴 패널 */}
						<div
							className={classNames(
								"fixed top-0 left-0 bg-white h-screen max-w-[367px] w-full z-50 transition-transform duration-300",
								{
									"translate-x-0": menuOpen,
									"-translate-x-full": !menuOpen,
								}
							)}>
							<div className="">
								<ul className="p-2 border-neutral-200 py-4 flex flex-col gap-2">
									<li>
										<div className="bg-[#252c51] text-white h-10 flex items-center justify-between px-4 mb-4">
											<span>Menu</span>
											<button onClick={handleMenuToggle}>
												<XMarkIcon className="size-8" />
											</button>
										</div>
									</li>
									<li>
										<Link
											className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
											href="/meta360"
											onClick={handleMenuToggle}>
											meta vision
										</Link>
									</li>
									<li>
										<Link
											className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
											href="/solution"
											onClick={handleMenuToggle}>
											solution
										</Link>
									</li>
									<li>
										<Link
											className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
											href="/pricing"
											onClick={handleMenuToggle}>
											pricing
										</Link>
									</li>
									<li>
										<Link
											className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
											href="/help"
											onClick={handleMenuToggle}>
											help
										</Link>
									</li>
									<li>
										<Link
											className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
											href="/partner"
											onClick={handleMenuToggle}>
											partner
										</Link>
									</li>
									{!currentIsLoggedIn ? (
										<li className="mt-4">
											<button
												onClick={handleUserMenuToggle}
												className={`${
													!userMenuOpen
														? `flex justify-between items-center w-full px-4 py-2 bg-gray-100 hover:text-neutral-900 rounded`
														: `flex justify-between items-center w-full px-4 py-2 bg-gray-100 text-neutral-900 rounded `
												}`}>
												<span>User</span>
												{userMenuOpen ? (
													<MinusIcon className="w-5 h-5" />
												) : (
													<PlusIcon className="w-5 h-5" />
												)}
											</button>
											{userMenuOpen && (
												<div className="flex flex-col mt-2">
													<Link
														className="px-8 py-2 hover:bg-gray-200 rounded"
														href="/login"
														onClick={handleMenuToggle}>
														Login
													</Link>
													<Link
														className="px-8 py-2 hover:bg-gray-200 rounded"
														href="/create-account"
														onClick={handleMenuToggle}>
														Sign Up
													</Link>
												</div>
											)}
										</li>
									) : (
										<>
											<li>
												<Link
													className="flex hover:text-neutral-900 px-4 py-2 hover:bg-gray-200 rounded"
													href="/profile"
													onClick={handleMenuToggle}>
													Profile
												</Link>
											</li>
											<li>
												<button
													className="w-full text-left px-4 py-2 hover:bg-gray-200 hover:text-neutral-900 rounded"
													onClick={() => {
														handleLogout();
														handleMenuToggle();
													}}>
													Logout
												</button>
											</li>
										</>
									)}
								</ul>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

"use client";

import Image from "next/image";
import meta360 from "@/public/main/metabank360.svg";
import metabank from "@/public/main/main_metabank_white2.png";
import metavision from "@/public/metavision.png";
import Link from "next/link";
import {
  Bars2Icon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  MinusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { logOut } from "@/app/store/slices/loginSlice";
import { GET_MY_QUERY } from "@/app/api/user/query";
import { useQuery } from "@apollo/client";
import useUser from "@/app/hooks/useUser";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Redux 상태에서 로그인 여부 가져오기
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  const { data } = useUser();

  const user = data?.getMyInfo;

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

  const handleLogout = useCallback(() => {
    dispatch(logOut());
    // 홈 페이지로 새로고침하며 이동
    window.location.href = "/";
  }, [dispatch]);

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // /admin 경로일 경우 빈 div 반환
  if (pathname?.startsWith("/admin")) {
    return <div></div>;
  }

  return (
    <div className="z-50 fixed w-full bg-meta py-8 max-md:navbar transition-all">
      {/* 데스크톱 메뉴 */}
      <div className="flex justify-center md:max-w-[870px] lg:max-w-[1100px] xl:max-w-[1300px] px-10 mx-auto max-md:hidden">
        <div className="flex items-center justify-between w-full md:text-base lg:text-lg xl:text-xl text-white transition-all">
          <Link className="max-w-40 max-h-10 max-lg:max-w-32" href="/">
            <Image
              src={metavision}
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
          {/* <Link className="hover:text-neutral-400" href="/partner">
                <span>partner</span>
              </Link> */}

          <div className="flex items-center gap-10 max-lg:gap-4">
            <Link
              className="max-w-36 max-h-10 max-lg:max-w-24"
              href="https://www.metabank3d.com/"
            >
              <Image
                src={metabank}
                alt="logo"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            <Link
              className="max-w-32 max-h-10 max-lg:max-w-20"
              href="http://360.metabank360.com/"
            >
              <Image
                src={meta360}
                alt="logo"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
          </div>
          <div className="flex gap-5 max-lg:gap-2">
            {!isLoggedIn ? (
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
                {user?.isAdmin ? (
                  <Link href="/admin">
                    <Cog6ToothIcon className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
                  </Link>
                ) : (
                  <div></div>
                )}
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
            className="text-white hover:bg-meta p-2 rounded-md transition-colors duration-200"
          >
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
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* 메뉴 패널 */}
            <div
              className={classNames(
                "fixed top-0 left-0 bg-white h-screen max-w-[367px] w-full z-50 transition-transform duration-300",
                {
                  "translate-x-0": menuOpen,
                  "-translate-x-full": !menuOpen,
                }
              )}
            >
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
                      onClick={handleMenuToggle}
                    >
                      meta vision
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
                      href="/solution"
                      onClick={handleMenuToggle}
                    >
                      solution
                    </Link>
                  </li>
                  {/* pricing은 모바일에서 숨김 */}
                  {/* <li>
                    <Link
                      className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
                      href="/pricing"
                      onClick={handleMenuToggle}
                    >
                      pricing
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      className="px-4 py-2 flex hover:text-neutral-900 hover:bg-gray-200 rounded"
                      href="/help"
                      onClick={handleMenuToggle}
                    >
                      help
                    </Link>
                  </li>

                  {!isLoggedIn ? (
                    <li className="mt-4">
                      <button
                        onClick={handleUserMenuToggle}
                        className={`${
                          !userMenuOpen
                            ? `flex justify-between items-center w-full px-4 py-2 bg-gray-100 hover:text-neutral-900 rounded`
                            : `flex justify-between items-center w-full px-4 py-2 bg-gray-100 text-neutral-900 rounded`
                        }`}
                      >
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
                            onClick={handleMenuToggle}
                          >
                            Login
                          </Link>
                          <Link
                            className="px-8 py-2 hover:bg-gray-200 rounded"
                            href="/create-account"
                            onClick={handleMenuToggle}
                          >
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
                          onClick={handleMenuToggle}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200 hover:text-neutral-900 rounded"
                          onClick={() => {
                            handleLogout();
                            handleMenuToggle();
                          }}
                        >
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

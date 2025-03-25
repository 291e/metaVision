"use client";

import metabank from "@/public/main/메타뱅크 CI 가로+슬로건 black 1.svg";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [openSections, setOpenSections] = useState<string[]>([]);

  const handleSectionToggle = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter((s) => s !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };

  // /admin 경로일 경우 빈 div 반환
  if (pathname.startsWith("/admin")) {
    return <div></div>;
  }

  return (
    <div className="relative bottom-0 z-40 w-full bg-white">
      <div className="h-px w-full bg-neutral-400 mb-12" />
      <div className="pl-32 max-md:pl-10">
        <Image src={metabank} alt="logo" width={0} height={0} />
      </div>
      <div className="py-12">
        <div className="mx-auto">
          <div className="*:text-neutral-800 flex justify-center gap-32 max-xl:gap-20 max-lg:gap-4 max-md:flex-col max-md:items-center">
            <div className="max-md:flex max-md:justify-between max-md:w-full max-md:px-10 max-md:border-b-[1px] max-md:pb-4">
              <span className="font-semibold text-lg select-none">
                (주)메타뱅크
              </span>
              <ul
                className={`flex flex-col gap-1.5 mt-6 text-neutral-500 transition-colors max-md:hidden`}
              >
                <li className="hover:text-black">
                  <Link
                    target="blink"
                    href="https://metabank3d.com/theme/metabank/sub/info_01.php"
                  >
                    회사 소개
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/info_04.php"
                    target="blink"
                  >
                    투자자 관계
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/info_03.php"
                    target="blink"
                  >
                    사회적 영향
                  </Link>
                </li>
              </ul>
              <span
                className="md:hidden cursor-pointer flex flex-col items-end"
                onClick={() => handleSectionToggle("(주)메타뱅크")}
              >
                <ChevronDownIcon className="size-7" />
                <ul
                  className={`flex flex-col gap-1.5 items-end mt-6 text-neutral-500 transition-all select-none animate-scale-in-top ${
                    openSections.includes("(주)메타뱅크")
                      ? "max-md:flex"
                      : "max-md:hidden"
                  }`}
                >
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/info_01.php"
                      target="blink"
                    >
                      회사 소개
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/info_04.php"
                      target="blink"
                    >
                      투자자 관계
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/info_03.php"
                      target="blink"
                    >
                      사회적 영향
                    </Link>
                  </li>
                </ul>
              </span>
            </div>
            <div className="max-md:flex max-md:justify-between max-md:w-full max-md:px-10 max-md:border-b-[1px] max-md:pb-4">
              <span className="font-semibold text-lg select-none">고객</span>
              <ul className="flex flex-col gap-1.5 mt-6 text-neutral-500 transition-colors max-md:hidden">
                <li className="hover:text-black">
                  <Link href="/login" target="blink">
                    클라우드 로그인
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link href="/create-account" target="blink">
                    무료 가입
                  </Link>
                </li>
              </ul>
              <span
                className="md:hidden cursor-pointer flex flex-col items-end"
                onClick={() => handleSectionToggle("고객")}
              >
                <ChevronDownIcon className="size-7" />
                <ul
                  className={`flex flex-col gap-1.5 items-end mt-6 text-neutral-500 transition-colors select-none animate-scale-in-top ${
                    openSections.includes("고객")
                      ? "max-md:flex"
                      : "max-md:hidden"
                  }`}
                >
                  <li className="hover:text-black">
                    <Link href="/login" target="blink">
                      클라우드 로그인
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link href="/create-account" target="blink">
                      무료 가입
                    </Link>
                  </li>
                </ul>
              </span>
            </div>
            <div className="max-md:flex max-md:justify-between max-md:w-full max-md:px-10 max-md:border-b-[1px] max-md:pb-4">
              <span className="font-semibold text-lg select-none">
                메타버스 콘텐츠
              </span>
              <ul className="flex flex-col gap-1.5 mt-6 text-neutral-500 transition-colors max-md:hidden">
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/business_02.php"
                    target="blink"
                  >
                    메타버스 쇼핑몰
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/business_03.php"
                    target="blink"
                  >
                    메타버스 박물관
                  </Link>
                </li>
              </ul>
              <span
                className="md:hidden cursor-pointer flex flex-col items-end"
                onClick={() => handleSectionToggle("메타버스 콘텐츠")}
              >
                <ChevronDownIcon className="size-7" />
                <ul
                  className={`flex flex-col gap-1.5 items-end mt-6 text-neutral-500 transition-colors select-none animate-scale-in-top ${
                    openSections.includes("메타버스 콘텐츠")
                      ? "max-md:flex"
                      : "max-md:hidden"
                  }`}
                >
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/business_02.php"
                      target="blink"
                    >
                      메타버스 쇼핑몰
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/business_03.php"
                      target="blink"
                    >
                      메타버스 박물관
                    </Link>
                  </li>
                </ul>
              </span>
            </div>
            <div className="max-md:flex max-md:justify-between max-md:w-full max-md:px-10 max-md:border-b-[1px] max-md:pb-4">
              <span className="font-semibold text-lg select-none">
                비즈니스 분야
              </span>
              <ul className="flex flex-col gap-1.5 mt-6 text-neutral-500 transition-colors max-md:hidden">
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_01.php"
                    target="blink"
                  >
                    쇼핑/ 소매업
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_02.php"
                    target="blink"
                  >
                    박물관/ 전시장
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_03.php"
                    target="blink"
                  >
                    부동산
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_04.php"
                    target="blink"
                  >
                    건축, 건설, 엔지니어링
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_05.php"
                    target="blink"
                  >
                    보험
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_06.php"
                    target="blink"
                  >
                    GIS
                  </Link>
                </li>
                <li className="hover:text-black">
                  <Link
                    href="https://metabank3d.com/theme/metabank/sub/service_07.php"
                    target="blink"
                  >
                    시설관리
                  </Link>
                </li>
              </ul>
              <span
                className="md:hidden cursor-pointer flex flex-col items-end"
                onClick={() => handleSectionToggle("비즈니스 분야")}
              >
                <ChevronDownIcon className="size-7" />
                <ul
                  className={`flex flex-col gap-1.5 items-end mt-6 text-neutral-500 transition-colors select-none animate-scale-in-top ${
                    openSections.includes("비즈니스 분야")
                      ? "max-md:flex"
                      : "max-md:hidden"
                  }`}
                >
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_01.php"
                      target="blink"
                    >
                      쇼핑/ 소매업
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_02.php"
                      target="blink"
                    >
                      박물관/ 전시장
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_03.php"
                      target="blink"
                    >
                      부동산
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_04.php"
                      target="blink"
                    >
                      건축, 건설, 엔지니어링
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_05.php"
                      target="blink"
                    >
                      보험
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_06.php"
                      target="blink"
                    >
                      GIS
                    </Link>
                  </li>
                  <li className="hover:text-black">
                    <Link
                      href="https://metabank3d.com/theme/metabank/sub/service_07.php"
                      target="blink"
                    >
                      시설관리
                    </Link>
                  </li>
                </ul>
              </span>
            </div>
            <div className="max-md:flex max-md:justify-between max-md:w-full max-md:px-10">
              <span className="font-semibold text-lg select-none">문의</span>
              <ul className="flex flex-col gap-1.5 mt-6 text-neutral-500 transition-colors max-md:hidden">
                <li className="hover:text-black">
                  <a href="mailto:metabank.ask@gmail.com">
                    metabank.ask@gmail.com
                  </a>
                </li>
                <li className="hover:text-black">
                  <a href={`tel:042-385-1008`}>042-385-1008</a>
                </li>
              </ul>
              <span
                className="md:hidden cursor-pointer flex flex-col items-end"
                onClick={() => handleSectionToggle("문의")}
              >
                <ChevronDownIcon className="size-7" />
                <ul
                  className={`flex flex-col gap-1.5 items-end mt-6 text-neutral-500 transition-colors select-none animate-scale-in-top ${
                    openSections.includes("문의")
                      ? "max-md:flex"
                      : "max-md:hidden"
                  }`}
                >
                  <li className="hover:text-black">
                    <a href="mailto:metabank.ask@gmail.com">
                      metabank.ask@gmail.com
                    </a>
                  </li>
                  <li className="hover:text-black">
                    <a href={`tal:042-385-1008`}>042-385-1008</a>
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex justify-center gap-6 *:size-7 pb-12">
        <FaFacebookF />
        <FaXTwitter />
        <FaInstagram />
        <FaYoutube />
      </div>

      <div className="h-px w-full bg-neutral-400" />
      <div className="py-6 bg-white flex justify-center items-center gap-20 max-md:gap-10 max-sm:gap-4 max-md:flex-col max-md:items-start max-md:pl-10 text-black ">
        <span>© 2023 metabank, Inc</span>
        <div className="gap-20 max-md:gap-10 max-sm:gap-4 flex max-md:text-neutral-400 max-md:underline-offset-2 max-md:underline">
          <Link href="">이용약관</Link>
          <Link href="">개인 정보 정책</Link>
          <Link href="">쿠키 정책</Link>
        </div>
      </div>
    </div>
  );
}

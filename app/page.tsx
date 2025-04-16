"use client";

import Image from "next/image";
import Link from "next/link";
import bg from "@/public/main/metavisionBg.png";
import item from "@/public/main/slider-item-1.gif";
import real from "@/public/main/realTime.svg";
import "./globals.css";
import Slide from "@/lib/swiper";
import app from "@/public/main/app.png";
import google from "@/public/main/google.png";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import CloseOpen from "@/components/shared/closeOpen";
import PhotogrammetryUpload from "@/components/products/PhotogrammetryUpload";
import ProductTabs from "@/components/products/ProductTab";
import PhotogrammetryViewer from "@/components/products/PhotogrammetryViewer";
import { useState } from "react";

const Home: React.FC = () => {
  // 모바일에서 토글을 위한 상태
  const [activeComponent, setActiveComponent] = useState<"viewer" | "upload">(
    "viewer"
  );

  return (
    <div className="pt-[80px] lg:pt-[94px] bg-white flex flex-col gap-10 text-black pb-20">
      <div className="relative h-[450px] lg:h-[518px] transition-all">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 p-5 md:flex-row md:items-center md:gap-40">
          {/* 768px 이상에서는 두 컴포넌트 모두 표시 */}
          <div className="hidden md:block w-full max-w-md">
            <PhotogrammetryViewer />
          </div>
          <div className="hidden md:block w-full max-w-md">
            <PhotogrammetryUpload />
          </div>

          {/* 768px 미만에서는 토글 방식으로 표시 */}
          <div className="w-full max-w-md md:hidden">
            {/* 토글 버튼 */}
            <div className="flex mb-4 bg-blue-100 rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeComponent === "viewer"
                    ? "bg-blue-500 text-white"
                    : "bg-transparent text-blue-600"
                }`}
                onClick={() => setActiveComponent("viewer")}
              >
                3D 모델 보기
              </button>
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeComponent === "upload"
                    ? "bg-blue-500 text-white"
                    : "bg-transparent text-blue-600"
                }`}
                onClick={() => setActiveComponent("upload")}
              >
                이미지 업로드
              </button>
            </div>

            {/* 선택된 컴포넌트만 표시 */}
            <div className="transition-all duration-300">
              {activeComponent === "viewer" && <PhotogrammetryViewer />}
              {activeComponent === "upload" && <PhotogrammetryUpload />}
            </div>
          </div>
        </div>
        <Image
          src={bg}
          className="object-cover object-center"
          fill
          alt="meta"
        />
      </div>

      <div className="pb-4 relative">
        <Image
          className="absolute z-10 -top-20 hidden"
          src={real}
          alt="real"
          width={0}
          height={0}
        />
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="font-semibold text-xl pt-10">실시간 업로드</span>
          <span>지금 시각 가장 핫한 3D 모델을 만나보세요.</span>
        </div>
        <div className="mx-auto">
          <div className="">
            <ProductTabs />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center w-full justify-center gap-10 px-4">
        <div className="px-4 py-5 max-xl:max-w-[400px] bg-gradient-to-r from-[#FEB6B2CC] to-[#FF4848CC] rounded-xl flex justify-center items-center shadow-md">
          <Link
            href="https://play.google.com/store/apps/details?id=com.metabank.meta360&pli=1"
            target="blink"
            className="flex gap-4 items-center text-white text-base hover:text-neutral-300"
          >
            <Image src={google} alt="Google" width={0} height={0} />
            <span>플레이스토어 메타비전</span>
            <ArrowRightCircleIcon className="size-7" />
          </Link>
        </div>
        <div className="px-8 py-5 bg-gradient-to-r from-[#7ABFFFCC] to-[#1C84FFCC] rounded-xl flex justify-center items-center shadow-md">
          <Link
            href="https://apps.apple.com/us/app/meta360/id6502634260"
            target="blink"
            className="flex gap-4 items-center justify-between text-white text-base hover:text-neutral-300"
          >
            <Image src={app} alt="App" width={0} height={0} />
            <span>앱스토어 메타비전</span>
            <ArrowRightCircleIcon className="size-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

"use client";

import Image from "next/image";
import Link from "next/link";
import app from "@/public/main/app.png";
import google from "@/public/main/google.png";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

const Home: React.FC = () => {
  // 모바일에서 토글을 위한 상태

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center w-full justify-center gap-10 px-4">
        <div className="px-4 py-5 max-xl:max-w-[400px] bg-gradient-to-r from-[#FEB6B2CC] to-[#FF4848CC] rounded-xl flex justify-center items-center shadow-md">
          <Link
            href="https://play.google.com/store/apps/details?id=com.metabank.bogofit"
            target="blink"
            className="flex gap-4 items-center text-white text-base hover:text-neutral-300"
          >
            <Image src={google} alt="Google" width={0} height={0} />
            <span>보고핏 플레이스토어</span>
            <ArrowRightCircleIcon className="size-7" />
          </Link>
        </div>
        <div className="px-8 py-5 bg-gradient-to-r from-[#7ABFFFCC] to-[#1C84FFCC] rounded-xl flex justify-center items-center shadow-md">
          <Link
            href="https://apps.apple.com/kr/app/bogofit/id6743146955"
            target="blink"
            className="flex gap-4 items-center justify-between text-white text-base hover:text-neutral-300"
          >
            <Image src={app} alt="App" width={0} height={0} />
            <span>보고핏 앱스토어</span>
            <ArrowRightCircleIcon className="size-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

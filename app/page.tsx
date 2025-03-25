import Image from "next/image";
import Link from "next/link";
import bg from "@/public/main/metavisionBg.png";
import item from "@/public/main/slider-item-1.gif";
import main2 from "@/public/main/shoose.svg";
import real from "@/public/main/realTime.svg";
import "./globals.css";
import Slide from "@/lib/swiper";
import app from "@/public/main/app.png";
import metaver from "@/public/main/metaVer.svg";
import google from "@/public/main/google.png";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import CloseOpen from "@/components/shared/closeOpen";
import PhotogrammetryUpload from "@/components/products/PhotogrammetryUpload";
import ProductTabs from "@/components/products/ProductTab";
import PhotogrammetryViewer from "@/components/products/PhotogrammetryViewer";

const Home: React.FC = () => {
  const mobile360 = [
    {
      text: "360도 회전 인터랙션 S/W '메타뱅크360' PC / 모바일용 무료 제공",
    },
    {
      text: "realmeta3d.com 퍼블리싱 지원(360도 뷰어 지원)",
    },
    {
      text: "GIF / MP4 애니메이션 제작 기능",
    },
    {
      text: "HTML 기반의 360도 회전 인터랙션",
    },
    {
      text: "인공지능 기반 자동 배경 제거 기능",
    },
  ];
  return (
    <div className="bg-white flex flex-col gap-10 text-black pb-20">
      <div className="relative h-[518px] transition-all">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 p-5 sm:flex-row sm:items-center sm:gap-40">
          <PhotogrammetryViewer />
          <PhotogrammetryUpload />
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
        <div className=" flex flex-col gap-2 items-center justify-center ">
          <span className="font-semibold text-xl pt-10">실시간 업로드</span>
          <span>지금 시각 가장 핫한 3D 모델을 만나보세요.</span>
        </div>
        <div className="mx-auto">
          <div className="">
            <ProductTabs />
          </div>
        </div>
      </div>

      <div className="w-full mt-24 lg:mt-0">
        <div className="flex flex-col lg:flex-row lg:justify-center mx-auto my-10 gap-32 items-center px-10">
          <div>
            <Image src={main2} alt="shoose" width={0} height={0} />
          </div>
          <div className="max-w-[454px] flex flex-col gap-8 items-center lg:items-start">
            <span className="w-full">
              리얼메타는 메타뱅크가 제공하는 메타비전 S/W를 이용해 3D 모델링
              데이터를 복원하고, 복원된 3D 데이터를 전 세계 사용자들이 무료 또는
              유료로 자유롭게 공유할 수 있는 3D 데이터 공유 플랫폼입니다.
            </span>
            <button className="bg-meta btn-meta text-white p-2 rounded-lg lg:hidden">
              지금 바로 시작하기
            </button>

            <div className="flex flex-col w-full *:w-full *:text-center *:py-3 *:lg:text-left *:lg:pl-3">
              {[
                "3D 모델용 무료 버전 S/W 메타비전 PC 지원",
                "고품질 데이터 시각화를 위한 웹 3D 뷰어 지원",
                "멤버십 운영",
                "회원 간 자유로운 데이터 공유 지원",
                "NFT 트레이딩을 갖춘 구성원간의 제도",
                "데이터 제작 프로세스의 동영상 강좌 무료 지원",
              ].map((text, index) => (
                <span
                  key={index}
                  className={`${index % 2 === 0 ? "bg-neutral-100" : ""}`}
                >
                  {text}
                </span>
              ))}
            </div>
            <button className="bg-meta hover:bg-blue-600 text-white p-2 rounded-lg lg:block hidden">
              지금 바로 시작하기
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col lg:flex-row items-center  lg:justify-center lg:gap-20 bg-neutral-50 py-10 px-4">
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-xl text-meta">다양성</span>
            <span className="text-center">
              리얼 메타는 다양한 모델을 구분 없이 제시하고 있습니다.
            </span>

            <Image
              className="pt-10"
              src={metaver}
              alt="model"
              width={0}
              height={0}
            />
          </div>
          <div className="flex flex-col items-center lg:hidden">
            <CloseOpen />
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 grid-rows-3 py-6 *:shadow-md *:rounded-lg *:flex *:justify-center *:items-center gap-4 *:text-meta *:p-4 animate-fade-in select-none *:text-center px-4">
              <span>운동화</span>
              <span>자동차 및 차량</span>
              <span>건축 자재</span>
              <span>사람</span>
              <span>자연 및 식물</span>
              <span>가구 및 가전제품</span>
              <span>장소 및 여행</span>
              <span>캐릭터 및 생물</span>
              <span>예술</span>
              <Link
                href="/meta360"
                className="text-meta w-full shadow-md col-span-3"
              >
                <div className="flex gap-4 items-center">
                  <p>모델 둘러보기</p>
                  <ArrowRightCircleIcon className="size-5" />
                </div>
              </Link>
            </div>
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

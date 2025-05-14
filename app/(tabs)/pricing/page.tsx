"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import back from "@/public/partner/partnerBack.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

// 금액에 따른 크레딧 계산 함수
const calculateCredits = (amount: number): number => {
  switch (amount) {
    case 10000:
      return 100;
    case 30000:
      return 350;
    case 50000:
      return 650;
    case 100000:
      return 1500;
    default:
      // 정해진 금액이 아닌 경우 1000원당 10크레딧으로 계산
      return Math.floor(amount / 100);
  }
};

const creditPackages: CreditPackage[] = [
  {
    id: "basic",
    name: "베이직",
    credits: 20,
    price: 0,
    description:
      "가장 쉽게 Meta Vision을 사용해 보세요. 결제가 필요하지 않습니다.",
    features: [
      "Meta Vision S/W 지원",
      "Meta Vision App 지원(Android, IOS)",
      "자유로운 공유(HTML, GIF, MP4)",
      "Meta Vision Web Viewer 지원",
    ],
  },
  {
    id: "starter",
    name: "스타터",
    credits: 100,
    price: 10000,
    description:
      "모든 필수 기능이 필요한 개인 또는 소규모 비즈니스에 적합합니다.",
    features: [
      "Meta Vision S/W 지원",
      "Meta Vision App 지원(Android, IOS)",
      "자유로운 공유(HTML, GIF, MP4)",
      "Meta Vision Web Viewer 지원",
    ],
  },
  {
    id: "professional",
    name: "프로페셔널",
    credits: 350,
    price: 30000,
    description: "좀 더 많은 크레딧이 필요한 전문가 및 중소기업에 적합합니다.",
    features: [
      "Meta Vision S/W 지원",
      "Meta Vision App 지원(Android, IOS)",
      "자유로운 공유(HTML, GIF, MP4)",
      "Meta Vision Web Viewer 지원",
      "우선 지원",
    ],
    isPopular: true,
  },
  {
    id: "business",
    name: "비즈니스",
    credits: 650,
    price: 50000,
    description:
      "대규모 프로젝트와 활발한 비즈니스 활동을 위한 최적의 선택입니다.",
    features: [
      "Meta Vision S/W 지원",
      "Meta Vision App 지원(Android, IOS)",
      "자유로운 공유(HTML, GIF, MP4)",
      "Meta Vision Web Viewer 지원",
      "우선 지원",
      "맞춤형 통계 리포트",
    ],
  },
  {
    id: "enterprise",
    name: "엔터프라이즈",
    credits: 1500,
    price: 100000,
    description:
      "대용량 데이터, 확장성 및 추가 기능이 필요한 기업에 적합합니다.",
    features: [
      "Meta Vision S/W 지원",
      "Meta Vision App 지원(Android, IOS)",
      "자유로운 공유(HTML, GIF, MP4)",
      "Meta Vision Web Viewer 지원",
      "최우선 지원",
      "맞춤형 통계 리포트",
      "기업용 API 액세스",
    ],
  },
];

export default function Pricing() {
  const router = useRouter();
  const { data: userData } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (pkg: CreditPackage) => {
    if (!userData?.getMyInfo) {
      router.push("/login");
      return;
    }

    if (pkg.price === 0) {
      // 무료 플랜 처리
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
          "test_ck_DnyRpQWGrNbdwvRLRnqLrKwv1M9E"
      );

      const orderId = `CREDIT_${Date.now()}`;
      const orderName = `${pkg.credits} 크레딧 구매`;

      await tossPayments.requestPayment("카드", {
        amount: pkg.price,
        orderId,
        orderName,
        customerName: userData.getMyInfo.email,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결제 요청 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pt-12">
      <div className="z-30">
        <div className="flex flex-col items-center text-black">
          <span className="font-semibold text-2xl z-20">
            메타 비전 요금제 및 가격
          </span>
          <span className="z-20">
            비지니스에 따라 적합한 플랜을 선택하세요.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-10 my-10 md:grid-cols-2 xl:grid-cols-3">
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className="px-5">
              <div
                className={`flex bg-white flex-col items-center w-full border-[1px] ${
                  pkg.isPopular
                    ? "border-blue-400 ring-2 ring-blue-400"
                    : "border-neutral-100"
                } shadow-lg rounded-3xl`}
              >
                {pkg.isPopular && (
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-b-lg text-sm font-medium">
                    인기 선택
                  </div>
                )}
                <div className="py-10 px-8 flex flex-col gap-5 w-full border-b-[1px] border-neutral-300 mb-6">
                  <div className="text-xl flex flex-col">
                    <span className="font-[550]">{pkg.name}</span>
                    {pkg.price === 0 ? (
                      <span>영원히 무료</span>
                    ) : (
                      <span>{pkg.credits} 크레딧</span>
                    )}
                  </div>
                  <span>{pkg.description}</span>
                  <span className="font-semibold text-2xl self-end pt-3 text-right">
                    {pkg.price === 0 ? (
                      <>
                        무료 사용 <br />{" "}
                        <span className="text-blue-500">KRW 0</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-normal text-gray-600">
                          한 번만 결제
                        </span>{" "}
                        <br />{" "}
                        <span className="text-blue-500">
                          KRW {pkg.price.toLocaleString()}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-col w-full px-8 gap-5 items-center pb-10 py-5">
                  <span className="font-medium text-2xl">주요 기능</span>
                  <ul className="*:flex *:items-center *:gap-2 *:py-2 self-start">
                    {pkg.features.map((feature, index) => (
                      <li key={index}>
                        <CheckIcon className="size-6 text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="text-neutral-600 pb-2">
                    * AI 3D 모델링 및 기타 서비스에 사용 가능한 {pkg.credits}개
                    크레딧을 제공합니다.
                  </span>
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading}
                    className={`hover:scale-105 rounded-md text-2xl text-white ${
                      pkg.isPopular ? "bg-blue-500" : "bg-blue-400"
                    } px-7 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                  >
                    {loading
                      ? "처리 중..."
                      : pkg.price === 0
                      ? "무료 시작"
                      : "구매하기"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md">
              <p className="text-lg mb-4 text-red-500">{error}</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 mr-2 bg-gray-300 rounded"
                  onClick={() => setError(null)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

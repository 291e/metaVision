"use client";

import { useEffect, useState, useRef } from "react";
import { PaymentResult } from "@/types/payment";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { MAKE_PAYMENT } from "@/app/api/payment/api";

const creditPackages: Record<string, number> = {
  basic: 20,
  business: 100,
  enterprise: 500,
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<{
    paymentKey: string;
    orderId: string;
    amount: number;
  } | null>(null);
  const isProcessing = useRef(false);

  // Apollo Client 뮤테이션 설정
  const [makePayment] = useMutation(MAKE_PAYMENT);

  const paymentKey = searchParams.get("paymentKey") || "";
  const orderId = searchParams.get("orderId") || "";
  const amount = searchParams.get("amount")
    ? Number(searchParams.get("amount"))
    : 0;

  useEffect(() => {
    const getParams = async () => {
      // 이미 처리 중이면 중복 실행 방지
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        if (!paymentKey || !orderId || !amount) {
          setError("결제 정보가 올바르지 않습니다.");
          return;
        }

        const data = {
          paymentKey,
          orderId,
          amount,
        };
        setRequestData(data);

        const token = localStorage.getItem("token") || "";

        // 기존 API 호출
        const response = await fetch("/api/confirm/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(data),
        });

        const dataResponse = await response.json();
        console.log("결제 확인 응답:", dataResponse);

        if (!response.ok) {
          // PROVIDER_ERROR인 경우 3초 후 재시도
          if (dataResponse.code === "PROVIDER_ERROR") {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const retryResponse = await fetch("/api/confirm/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token,
              },
              body: JSON.stringify(data),
            });
            const retryData = await retryResponse.json();
            console.log("재시도 응답:", retryData);

            if (!retryResponse.ok) {
              throw new Error(
                retryData.message || "결제 확인 중 오류가 발생했습니다."
              );
            }
            setPaymentResult(retryData);
          } else {
            throw new Error(
              dataResponse.message || "결제 확인 중 오류가 발생했습니다."
            );
          }
        } else {
          setPaymentResult(dataResponse);
        }

        // 추가: Apollo Client의 makePayment 뮤테이션 호출
        try {
          console.log("makePayment 뮤테이션 요청 데이터:", data);

          const result = await makePayment({
            variables: {
              paymentKey: data.paymentKey,
              orderId: data.orderId,
              amount: data.amount,
            },
          });

          console.log("makePayment 뮤테이션 응답:", result);

          if (!result.data.makePayment.success) {
            console.error(
              "makePayment 뮤테이션 오류:",
              result.data.makePayment.message
            );
            // 서버 오류 메시지가 있으면 표시
            if (result.errors) {
              console.error("서버 오류 상세:", result.errors);
            }
          } else {
            // 성공 시 크레딧 정보 업데이트
            if (result.data.makePayment.credit) {
              setPaymentResult((prev) => ({
                ...prev!,
                credits: result.data.makePayment.credit.amount,
                success: true,
                message: `${result.data.makePayment.credit.amount} 크레딧이 추가되었습니다.`,
              }));
            }
          }
        } catch (confirmError) {
          console.error("makePayment 뮤테이션 호출 중 오류:", confirmError);
          // API 호출 실패는 사용자에게 표시하지 않음
        }
      } catch (error) {
        console.error("결제 확인 중 오류 발생:", error);
        setError(
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
        isProcessing.current = false;
      }
    };

    getParams();
  }, [searchParams, makePayment, paymentKey, orderId, amount]);

  const handlePaymentConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        return;
      }

      const result = await makePayment({
        variables: {
          paymentKey,
          orderId,
          amount,
        },
      });

      if (result.data.makePayment.success) {
        setPaymentResult(result.data.makePayment);
      } else {
        setError(
          result.data.makePayment.message || "결제 확인 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      console.error("결제 확인 중 오류:", error);
      setError("결제 확인 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto pt-16 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error
                  ? "결제 처리 중 오류가 발생했습니다"
                  : "결제가 완료되었습니다"}
              </h1>
              <p className="text-gray-500 text-center">
                {paymentResult?.methodName || "신용카드"}로 결제가
                완료되었습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto pt-16 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-red-500 mb-2">{error}</h1>
              <p className="text-gray-500 text-center">
                {paymentResult?.methodName || "신용카드"}로 결제가
                완료되었습니다.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">주문번호</span>
                <span className="font-medium">{paymentResult?.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">결제금액</span>
                <span className="font-medium">
                  {requestData?.amount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">결제수단</span>
                <span className="font-medium">
                  {paymentResult?.methodName || "신용카드"}
                </span>
              </div>
              {paymentResult?.credits && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">추가된 크레딧</span>
                  <span className="font-medium text-blue-600">
                    {paymentResult.credits} 크레딧
                  </span>
                </div>
              )}
              {paymentResult?.message && (
                <div className="text-sm text-blue-600 text-center mt-2">
                  {paymentResult.message}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto pt-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error
                ? "결제 처리 중 오류가 발생했습니다"
                : "결제가 완료되었습니다"}
            </h1>
            <p className="text-gray-500 text-center">
              {paymentResult?.methodName || "신용카드"}로 결제가 완료되었습니다.
            </p>
          </div>

          {!error && (
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">주문번호</span>
                <span className="font-medium">{paymentResult?.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">결제금액</span>
                <span className="font-medium">
                  {requestData?.amount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">결제수단</span>
                <span className="font-medium">
                  {paymentResult?.methodName || "신용카드"}
                </span>
              </div>
              {paymentResult?.credits && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">추가된 크레딧</span>
                  <span className="font-medium text-blue-600">
                    {paymentResult.credits} 크레딧
                  </span>
                </div>
              )}
              {paymentResult?.message && (
                <div className="text-sm text-blue-600 text-center mt-2">
                  {paymentResult.message}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

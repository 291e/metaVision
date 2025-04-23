import useUser from "@/app/hooks/useUser";

const API_BASE_URL = "http://192.168.0.202:4000";

// 1. 결제 확인 및 크레딧 변환
export const confirmPayment = async (
  data: {
    paymentKey: string;
    orderId: string;
    amount: number;
  },
  token: string
) => {
  console.log("API 요청 데이터:", data);

  const response = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log("API 응답:", responseData);
  return responseData;
};

// 2. 결제 내역 조회
export const getPaymentHistory = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/history`, {
    headers: {
      token,
    },
  });
  return response.json();
};

// 3. 크레딧 사용
export const useCredits = async (
  amount: number,
  description: string,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/credits/use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ amount, description }),
  });
  return response.json();
};

// 4. 크레딧 잔액 조회
export const getCreditBalance = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/credits/balance`, {
    headers: {
      token,
    },
  });
  return response.json();
};

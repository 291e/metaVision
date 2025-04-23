// src/hooks/useCredit.ts
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CREDIT_BALANCE,
  ADD_CREDITS,
  USE_CREDITS,
} from "@/app/api/payment/mutation";

export const useCredit = () => {
  // 크레딧 잔액 조회
  const {
    data: balanceData,
    loading: balanceLoading,
    refetch: refetchBalance,
  } = useQuery(GET_CREDIT_BALANCE);

  // 크레딧 추가
  const [addCredits, { loading: addLoading }] = useMutation(ADD_CREDITS, {
    onCompleted: () => {
      refetchBalance(); // 크레딧 추가 후 잔액 갱신
    },
  });

  // 크레딧 사용
  const [useCredits, { loading: useLoading }] = useMutation(USE_CREDITS, {
    onCompleted: () => {
      refetchBalance(); // 크레딧 사용 후 잔액 갱신
    },
  });

  return {
    balance: balanceData?.getCreditBalance.credits || 0,
    balanceLoading,
    addCredits: (amount: number, description: string) =>
      addCredits({ variables: { amount, description } }),
    useCredits: (amount: number, description: string) =>
      useCredits({ variables: { amount, description } }),
    addLoading,
    useLoading,
  };
};

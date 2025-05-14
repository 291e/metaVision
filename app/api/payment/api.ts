// src/graphql/payments.ts
import { gql } from "@apollo/client";

// 결제 처리 (makePayment)
export const MAKE_PAYMENT = gql`
  mutation makePayment($paymentKey: String!, $orderId: String!, $amount: Int!) {
    makePayment(paymentKey: $paymentKey, orderId: $orderId, amount: $amount) {
      success
      message
      payment {
        id
        amount
        status
        paymentKey
        orderId
        createdAt
        updatedAt
      }
      credit {
        id
        amount
        type
        description
        currentBalance
        createdAt
      }
      remainingBalance
    }
  }
`;

// 결제 내역 조회 (getPayment)
export const GET_PAYMENT = gql`
  query getPayment {
    getPayment {
      success
      message
      payments {
        id
        amount
        status
        paymentKey
        orderId
        createdAt
        updatedAt
      }
    }
  }
`;

// 크레딧 사용 (useCredit)
export const USE_CREDIT = gql`
  mutation useCredit($amount: Int!, $description: String!) {
    useCredit(amount: $amount, description: $description) {
      success
      message
      credit {
        id
        amount
        type
        description
        currentBalance
        createdAt
      }
      remainingBalance
    }
  }
`;

// 크레딧 조회 (getCredit)
export const GET_CREDIT = gql`
  query getCredit {
    getCredit {
      success
      message
      balance
      history {
        id
        amount
        type
        description
        currentBalance
        createdAt
      }
    }
  }
`;

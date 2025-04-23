"use client";

import { useQuery } from "@apollo/client";
import { GetMyInfoQuery } from "../gql/graphql";
import { GET_MY_QUERY } from "../api/user/query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function useUser() {
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  const token = useSelector((state: RootState) => state.login.token);

  const { data, loading, error, refetch } = useQuery<GetMyInfoQuery>(
    GET_MY_QUERY,
    {
      skip: !isLoggedIn, // 로그인 상태에 따라 쿼리 실행 여부 결정
      fetchPolicy: "network-only",
      context: {
        headers: {
          token,
        },
      },
    }
  );

  return { data, loading, error, refetch, token };
}

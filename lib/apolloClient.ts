// apolloClient.ts
"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

// Reactive variables
export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
      tokenVar(token);
      isLoggedInVar(true);
    } catch (e) {
      console.error("Error storing token:", e);
    }
  }
};

export const logUserOut = async (client: ApolloClient<any>) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
      tokenVar("");
      isLoggedInVar(false);
      // Apollo Client 캐시 클리어
      await client.clearStore();
    } catch (e) {
      console.error("Error removing token:", e);
    }
  }
};

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    isLoggedInVar(true);
    tokenVar(token);
  }
}

// 인증 헤더에 토큰을 추가하는 Apollo Link
const authLink = setContext((_, { headers }) => {
  let token = tokenVar();

  // 클라이언트에서 토큰을 가져옴
  if (typeof window !== "undefined" && !token) {
    token = localStorage.getItem("token") || "";
    tokenVar(token);
  }

  return {
    headers: {
      ...headers,
      token: token ? `${token}` : "",
    },
  };
});

// GraphQL 서버로의 HTTP 요청을 위한 Link
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL, // GraphQL 서버 주소
  credentials: "omit",
});

const apolloLink = ApolloLink.from([
  authLink,
  new SSRMultipartLink({
    stripDefer: true,
  }),
  httpLink,
]);

// Apollo Client 설정 함수
export const makeClient = () =>
  new NextSSRApolloClient({
    link: apolloLink,
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allProduct: offsetLimitPagination(),
            getMyProduct: offsetLimitPagination(),
          },
        },
      },
    }),
    connectToDevTools: false,
  });

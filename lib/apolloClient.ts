import store from "@/app/store/store";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

// Redux 상태에서 토큰 가져오기
const authLink = setContext((_, { headers }) => {
  const token = store.getState().login.token;

  return {
    headers: {
      ...headers,
      token: token ? `${token}` : "",
    },
  };
});

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

export const makeClient = () =>
  new NextSSRApolloClient({
    link: apolloLink,
    cache: new NextSSRInMemoryCache(),
  });

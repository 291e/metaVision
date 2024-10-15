// "use client"; // 이 컴포넌트는 클라이언트 전용으로 실행됩니다.

// import React from "react";
// import {
//   ApolloClient,
//   ApolloLink,
//   InMemoryCache,
//   createHttpLink,
//   makeVar,
//   HttpLink,
//   ApolloProvider,
// } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";
// import { setContext } from "@apollo/client/link/context";
// import { offsetLimitPagination } from "@apollo/client/utilities";

// const TOKEN = "token";

// // Reactive variables
// export const isLoggedInVar = makeVar(
//   typeof window !== "undefined" ? Boolean(localStorage.getItem(TOKEN)) : false
// );

// export const tokenVar = makeVar("");
// export const langVar = makeVar("");

// // Log in user and store token in localStorage
// export const logUserIn = (token: string) => {
//   console.log("log user in");
//   //   localStorage.setItem(TOKEN, token);
//   //   tokenVar(token);
//   //   isLoggedInVar(true);
//   //   console.log("log user in success");
//   if (typeof window !== "undefined") {
//     localStorage.setItem(TOKEN, token);
//     isLoggedInVar(true);
//     tokenVar(token);
//     console.log("log user in success");
//   }
// };

// // Log out user and remove token from localStorage
// export const logUserOut = async () => {
//   //   localStorage.removeItem(TOKEN);
//   //   tokenVar("");
//   //   isLoggedInVar(false);
//   if (typeof window !== "undefined") {
//     localStorage.removeItem(TOKEN);
//     isLoggedInVar(false);
//     tokenVar("");
//   }
// };

// // Set authorization header using the token from localStorage
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem(TOKEN);
//   return {
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const httpLink = createHttpLink({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
//   credentials: "include",
// });

// const onErrorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   }
//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

// const httpLinks = ApolloLink.from([authLink, onErrorLink, httpLink]);

// export const client = new ApolloClient({
//   link: httpLinks,
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           allProduct: offsetLimitPagination(),
//           getMyProduct: offsetLimitPagination(),
//         },
//       },
//     },
//   }),
// });

// export default function ApolloClientProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <ApolloProvider client={client}>{children}</ApolloProvider>;
// }

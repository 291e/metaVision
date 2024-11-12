"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { loadToken } from "@/app/store/slices/loginSlice";
import store from "@/app/store/store";
import ApolloWrapper from "@/lib/ApolloWrapper";

export default function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(loadToken()); // store에 직접 접근하여 초기화
  }, []);

  return (
    <Provider store={store}>
      <ApolloWrapper>{children}</ApolloWrapper>
    </Provider>
  );
}

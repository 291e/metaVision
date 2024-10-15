import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Noto_Sans_KR } from "next/font/google";
import ReduxProvider from "@/lib/store";
import ApolloWrapper from "@/lib/ApolloWrapper";
import { getServerSideProps } from "@/lib/getServerSideProps"; // 새로 추가된 부분
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | MetaBank360",
    default: "MetaBank360",
  },
  description: "360도 회전 촬영",
};

// `getServerSideProps`로 서버에서 상태를 가져와 초기화합니다.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansKr.className} overflow-x-hidden bg-white`}>
        <ApolloWrapper>
          <Header />
          {children}
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}

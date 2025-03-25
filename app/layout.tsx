import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Noto_Sans_KR } from "next/font/google";
import ApolloWrapper from "@/lib/ApolloWrapper";
import dynamic from "next/dynamic";

const ClientProviders = dynamic(() => import("@/lib/reduxClient"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "RealMeta | MetaVision",
    default: "MetaVision",
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
      <body
        className={`${notoSansKr.className} overflow-x-hidden h-screen bg-white overflow-hidden `}
      >
        <ClientProviders>
          <ApolloWrapper>
            <div className="flex flex-col w-full h-full overflow-y-auto">
              <div className="flex flex-col flex-1">
                <Header />
                <main className="pt-[80px] lg:pt-[94px] flex-1 ">
                  {children}
                </main>
              </div>

              <div className="flex flex-1 items-end">
                <Footer />
              </div>
            </div>
          </ApolloWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}

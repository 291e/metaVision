import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // 최신 방식으로 수정

export async function GET(request: NextRequest) {
  const { pathname, search } = new URL(request.url);

  // 프록시 경로를 제거하여 대상 경로 추출
  const targetPath = pathname.replace(/^\/api\/proxy/, "") + search;

  // 대상 URL 설정 (예: S3 버킷 URL)
  const targetUrl = `https://metascan-s3.s3.ap-northeast-2.amazonaws.com${targetPath}`;

  try {
    // 대상 URL로부터 데이터 가져오기
    const response = await fetch(targetUrl);

    // 응답 헤더 설정
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*"); // 필요에 따라 설정

    // 응답 생성
    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse(JSON.stringify({ error: "Proxy Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

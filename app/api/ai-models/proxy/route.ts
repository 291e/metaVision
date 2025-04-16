import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// 하드코딩된 S3 값 (환경 변수가 없을 경우 대체)
const S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION || "ap-northeast-2";
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "metascan-s3";

// 공개 사용 가능한 예제 모델 URL
const PUBLIC_MODEL_URL =
  "https://threejs.org/examples/models/gltf/LittlestTokyo.glb";

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_LOCAL_KEY || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY || "",
  },
});

export async function GET(request: NextRequest) {
  try {
    // URL에서 key 파라미터 추출
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { message: "Object key is required" },
        { status: 400 }
      );
    }

    console.log("S3 객체 프록시 요청:", key);
    console.log("S3 버킷:", S3_BUCKET);
    console.log("리전:", S3_REGION);

    try {
      // S3에서 객체 가져오기
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        throw new Error("Object not found or empty");
      }

      // Body를 바이너리 데이터로 변환
      const arrayBuffer = await response.Body.transformToByteArray();

      // 응답 헤더 설정
      const headers = new Headers();
      headers.set("Content-Type", "model/gltf-binary");
      headers.set("Content-Length", arrayBuffer.length.toString());
      headers.set("Cache-Control", "public, max-age=86400"); // 하루 동안 캐싱
      headers.set("Access-Control-Allow-Origin", "*");

      // 모델 데이터 반환
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: headers,
      });
    } catch (s3Error) {
      console.error("S3 객체 접근 오류:", s3Error);

      // S3 접근 실패 시 ThreeJS 예제 모델 제공 (공개 URL)
      console.log("대체 모델 URL 제공:", PUBLIC_MODEL_URL);

      return NextResponse.json(
        {
          message: "Failed to access S3 object, providing public model",
          url: PUBLIC_MODEL_URL,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("S3 프록시 오류:", error);

    return NextResponse.json(
      {
        message: "Failed to proxy S3 object",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

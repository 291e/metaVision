import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

// 환경 변수 로깅
console.log("S3 설정 디버깅:");
console.log("리전:", process.env.NEXT_PUBLIC_AWS_S3_REGION);
console.log("버킷:", process.env.NEXT_PUBLIC_AWS_S3_BUCKET);
console.log(
  "액세스 키 설정 여부:",
  process.env.NEXT_PUBLIC_AWS_LOCAL_KEY ? "있음" : "없음"
);
console.log(
  "시크릿 키 설정 여부:",
  process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY ? "있음" : "없음"
);

// 하드코딩된 S3 값 (환경 변수가 없을 경우 대체)
const S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION || "ap-northeast-2";
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "metascan-s3";

// S3 클라이언트 생성
let s3Client: S3Client | null = null;

try {
  s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_LOCAL_KEY || "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY || "",
    },
  });
  console.log("S3 클라이언트 초기화 성공");
} catch (error) {
  console.error("S3 클라이언트 초기화 실패:", error);
}

export async function GET(request: Request) {
  // URL에서 userId 파라미터 추출
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("API 요청 수신:", request.url);
  console.log("userId:", userId);

  // userId가 없으면 오류 반환
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  // S3 클라이언트가 초기화되지 않았으면 오류 반환
  if (!s3Client) {
    console.error("S3 클라이언트가 초기화되지 않았습니다");
    return NextResponse.json(
      { message: "S3 client initialization failed" },
      { status: 500 }
    );
  }

  try {
    // S3에서 사용자의 AI 3D 모델 폴더 검색
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: `AI_3D_Models/${userId}/`, // 해당 사용자의 폴더만 검색
      MaxKeys: 100, // 최대 가져올 파일 수
    });

    console.log("S3 검색 시작:", `AI_3D_Models/${userId}/`, "버킷:", S3_BUCKET);

    const response = await s3Client.send(command);

    console.log(
      "S3 검색 결과:",
      response.Contents?.length || 0,
      "개 항목 발견"
    );

    // 응답이 없거나 빈 경우 샘플 데이터 반환
    if (!response.Contents || response.Contents.length === 0) {
      console.log("S3 검색 결과가 없어 샘플 데이터 반환");
      // 샘플 데이터 생성
      const sampleModels = [
        {
          key: `AI_3D_Models/${userId}/model1.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 1",
          lastModified: new Date().toISOString(),
        },
        {
          key: `AI_3D_Models/${userId}/model2.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 2",
          lastModified: new Date().toISOString(),
        },
        {
          key: `AI_3D_Models/${userId}/model3.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 3",
          lastModified: new Date().toISOString(),
        },
      ];
      return NextResponse.json({ models: sampleModels });
    }

    // 파일 목록 변환 및 URL 생성
    const models = [];
    for (const item of response.Contents || []) {
      if (item.Key?.endsWith(".glb")) {
        const pathParts = item.Key.split("/");
        const fileName = pathParts[pathParts.length - 1];
        const title = fileName.replace(".glb", "");

        // 직접 S3 URL 생성 (public-read 권한이 있는 경우)
        const directUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${item.Key}`;

        models.push({
          key: item.Key,
          url: directUrl,
          title: title,
          lastModified: item.LastModified,
        });
      }
    }

    console.log("필터링된 GLB 파일:", models.length, "개");

    // GLB 파일이 없는 경우 샘플 데이터 반환
    if (models.length === 0) {
      console.log("필터링된 GLB 파일이 없어 샘플 데이터 반환");
      // 샘플 데이터 생성
      const sampleModels = [
        {
          key: `AI_3D_Models/${userId}/model1.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 1",
          lastModified: new Date().toISOString(),
        },
        {
          key: `AI_3D_Models/${userId}/model2.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 2",
          lastModified: new Date().toISOString(),
        },
        {
          key: `AI_3D_Models/${userId}/model3.glb`,
          url: `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/AI_3D_Models/${userId}/AI_3D_delete_1744781564450.glb`,
          title: "트러플 AI 3D 모델 3",
          lastModified: new Date().toISOString(),
        },
      ];
      return NextResponse.json({ models: sampleModels });
    }

    // 결과 반환
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error in S3 API:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch AI models",
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
      { status: 500 }
    );
  }
}

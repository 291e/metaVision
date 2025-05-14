import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// S3 클라이언트 생성 (서버 사이드에서만 실행됨)
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_LOCAL_KEY!,
    secretAccessKey: process.env.AWS_LOCAL_SECRET_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    // URL에서 사용자 ID 가져오기
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // S3에서 사용자의 3D 모델 목록 조회
    const prefix = `AI_3D_Models/${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET!,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    // 파일이 없는 경우
    if (!response.Contents || response.Contents.length === 0) {
      return NextResponse.json({
        success: true,
        models: [],
      });
    }

    // 파일 정보 가공
    const models = response.Contents.map((object) => {
      // 파일명에서 번호 추출
      const key = object.Key || "";
      const fileName = key.split("/").pop() || "";
      const match = fileName.match(/Ai3D_(\d+)\.glb/);
      const fileNumber = match ? parseInt(match[1], 10) : 0;

      // S3 URL 생성
      const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;

      // 파일 이름 및 기타 정보
      return {
        modelId: fileNumber,
        fileName,
        title: `Ai3D_${fileNumber}`,
        url,
        viewerUrl: `/viewer?model=${encodeURIComponent(url)}`, // 뷰어 페이지 URL
        lastModified: object.LastModified,
        size: object.Size,
        type: "glb", // GLTF Binary 타입
      };
    }).sort((a, b) => b.modelId - a.modelId); // 최신 모델이 먼저 오도록 정렬

    return NextResponse.json({
      success: true,
      models,
    });
  } catch (error) {
    console.error("모델 목록 조회 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: "모델 목록을 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

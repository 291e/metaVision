import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import AWS from "aws-sdk";

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

// S3 클라이언트 생성 (SDK v3)
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

// SDK v2 S3 클라이언트 생성
const s3v2 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_LOCAL_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY,
  region: S3_REGION,
});

// 파일명에서 고유한 이름 생성
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.includes(".")
    ? originalName.substring(originalName.lastIndexOf("."))
    : ".glb";
  const baseName = originalName.includes(".")
    ? originalName.substring(0, originalName.lastIndexOf("."))
    : originalName;

  return `${baseName}_${timestamp}${extension}`;
}

// 사용자의 기존 모델 파일 수를 확인하는 함수
async function getNextFileNumber(userId: string): Promise<number> {
  if (!s3Client) return Date.now();

  try {
    const prefix = `AI_3D_Models/${userId}/Ai3D_`;

    // S3에서 해당 경로의 객체 리스트 조회
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    // 파일이 없는 경우 1부터 시작
    if (!response.Contents || response.Contents.length === 0) {
      return 1;
    }

    // 파일 이름에서 숫자 부분 추출하여 최대값 찾기
    let maxNumber = 0;

    for (const item of response.Contents) {
      if (item.Key) {
        // 파일명에서 숫자 추출
        const match = item.Key.match(/Ai3D_(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    }

    // 다음 번호 반환
    return maxNumber + 1;
  } catch (error) {
    console.error("파일 번호 확인 오류:", error);
    // 오류 발생 시 기본값으로 현재 시간 사용
    return Date.now();
  }
}

export async function GET(request: Request) {
  // URL에서 userId 파라미터 추출
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("API 요청 수신:", request.url);
  console.log("userId:", userId);

  // S3 클라이언트가 초기화되지 않았으면 오류 반환
  if (!s3Client) {
    console.error("S3 클라이언트가 초기화되지 않았습니다");
    return NextResponse.json(
      { message: "S3 client initialization failed" },
      { status: 500 }
    );
  }

  try {
    let prefix = "AI_3D_Models/";
    if (userId) {
      // 특정 사용자의 모델만 검색
      prefix = `AI_3D_Models/${userId}/`;
      console.log("특정 사용자 모델 검색:", prefix);
    } else {
      console.log("모든 사용자 모델 검색:", prefix);
    }

    // S3에서 AI 3D 모델 폴더 검색
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix, // 모든 사용자 또는 특정 사용자의 폴더 검색
      MaxKeys: 100, // 최대 가져올 파일 수 제한
    });

    console.log("S3 검색 시작:", prefix, "버킷:", S3_BUCKET);

    const response = await s3Client.send(command);

    console.log(
      "S3 검색 결과:",
      response.Contents?.length || 0,
      "개 항목 발견"
    );

    // 응답이 없거나 빈 경우 빈 배열 반환
    if (!response.Contents || response.Contents.length === 0) {
      console.log("S3 검색 결과가 없어 빈 배열 반환");
      return NextResponse.json({ models: [] });
    }

    // 파일 목록 변환 및 URL 생성
    const models = [];
    // 먼저 모든 .glb 파일의 키를 찾음
    const glbFiles =
      response.Contents?.filter((item) => item.Key?.endsWith(".glb")) || [];

    // 폴더 구조로 정리된 파일들을 처리
    for (const item of glbFiles) {
      if (item.Key) {
        // 경로 분석
        const pathParts = item.Key.split("/");
        const fileName = pathParts[pathParts.length - 1]; // 파일명 (model.glb)
        const folderPath = item.Key.substring(0, item.Key.lastIndexOf("/")); // 폴더 경로
        const folderName = pathParts[pathParts.length - 2]; // 폴더명 (Ai3D_숫자)
        const title = folderName; // 폴더명을 제목으로 사용

        // 모델 파일 URL 생성
        const modelUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${item.Key}`;

        // 같은 폴더에 있는 이미지 파일 검색 (jpg, jpeg, png 등)
        const imageFiles =
          response.Contents?.filter(
            (imgItem) =>
              imgItem.Key?.startsWith(folderPath) &&
              (imgItem.Key?.endsWith(".jpg") ||
                imgItem.Key?.endsWith(".jpeg") ||
                imgItem.Key?.endsWith(".png"))
          ) || [];

        // 이미지 파일이 있으면 첫 번째 이미지를 썸네일로 사용
        let thumbnailUrl = "";
        if (imageFiles.length > 0 && imageFiles[0].Key) {
          thumbnailUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${imageFiles[0].Key}`;
        } else {
          // 이미지 파일이 없으면 모델 파일에서 .glb 확장자를 .jpg로 변경하여 기본 썸네일 경로 생성
          thumbnailUrl = modelUrl.replace(".glb", ".jpg");
        }

        models.push({
          key: item.Key,
          url: modelUrl,
          title: title,
          lastModified: item.LastModified,
          thumbnail: thumbnailUrl,
          folderPath: folderPath,
        });
      }
    }

    console.log("필터링된 GLB 파일:", models.length, "개");

    // GLB 파일이 없는 경우 빈 배열 반환
    if (models.length === 0) {
      console.log("필터링된 GLB 파일이 없어 빈 배열 반환");
      return NextResponse.json({ models: [] });
    }

    // 최신 파일순으로 정렬 (LastModified 내림차순)
    models.sort((a, b) => {
      const dateA =
        a.lastModified instanceof Date
          ? a.lastModified
          : new Date(a.lastModified || 0);
      const dateB =
        b.lastModified instanceof Date
          ? b.lastModified
          : new Date(b.lastModified || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // 결과 반환 (최대 20개)
    return NextResponse.json({ models: models.slice(0, 20) });
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

// 파일 업로드 API
export async function POST(request: Request) {
  try {
    console.log("파일 업로드 요청 수신");

    // 클라이언트 요청 처리 - JSON 형식과 FormData 형식 모두 지원
    let userId = "";
    let modelTitle = "";
    let modelFile: File | Buffer | null = null;
    let originalImage: File | Buffer | null = null; // 원본 이미지 추가
    let fileName = "";
    let fileType = "";
    let fileSize = 0;
    let imageName = ""; // 이미지 파일명 추가
    let imageType = ""; // 이미지 타입 추가

    const contentType = request.headers.get("content-type") || "";
    console.log("요청 컨텐츠 타입:", contentType);

    if (contentType.includes("application/json")) {
      // JSON 형식 처리
      const jsonData = await request.json();
      console.log("JSON 데이터 수신:", JSON.stringify(jsonData, null, 2));

      userId = jsonData.userId;
      modelTitle = jsonData.modelTitle;

      if (jsonData.fileData) {
        // Base64 데이터를 Buffer로 변환
        const fileBuffer = Buffer.from(jsonData.fileData, "base64");
        modelFile = fileBuffer;
        fileName = jsonData.fileName || `model_${Date.now()}.glb`;
        fileType = jsonData.fileType || "model/gltf-binary";
        fileSize = jsonData.fileSize || fileBuffer.length;
      }

      // 원본 이미지 데이터 처리
      if (jsonData.imageData) {
        console.log("원본 이미지 데이터 발견 (JSON)");
        const imageBuffer = Buffer.from(jsonData.imageData, "base64");
        originalImage = imageBuffer;
        imageName = jsonData.imageName || `image_${Date.now()}.jpg`;
        imageType = jsonData.imageType || "image/jpeg";
      }
    } else {
      // FormData 형식 처리
      const formData = await request.formData();
      console.log("FormData 키:", Array.from(formData.keys()));

      modelFile = formData.get("modelFile") as File;
      // originalImage가 전송되었는지 확인
      const hasOriginalImage = formData.has("originalImage");
      console.log("원본 이미지 필드 존재:", hasOriginalImage);

      originalImage = formData.get("originalImage") as File; // 원본 이미지 가져오기
      userId = formData.get("userId") as string;
      modelTitle = formData.get("modelTitle") as string;

      if (modelFile) {
        fileName = modelFile.name;
        fileType = modelFile.type || "model/gltf-binary";
        fileSize = modelFile.size;
      }

      if (originalImage) {
        console.log(
          "원본 이미지 데이터 발견 (FormData):",
          originalImage.name,
          originalImage.type
        );
        imageName = (originalImage as File).name;
        imageType = (originalImage as File).type || "image/jpeg";
      } else {
        console.log("원본 이미지 데이터 없음 (FormData)");

        // 대체 필드 이름 시도
        const alternativeFields = [
          "image",
          "photo",
          "thumbnail",
          "thumbnailImage",
          "imageFile",
        ];
        for (const field of alternativeFields) {
          if (formData.has(field)) {
            console.log(`대체 이미지 필드 발견: ${field}`);
            originalImage = formData.get(field) as File;
            if (originalImage) {
              imageName = (originalImage as File).name;
              imageType = (originalImage as File).type || "image/jpeg";
              break;
            }
          }
        }
      }
    }

    if (!modelFile || !userId) {
      return NextResponse.json(
        { success: false, message: "모델 파일과 사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 파일 정보 로깅
    console.log("업로드 파일 정보:", {
      fileName,
      fileType,
      fileSize,
      userId,
      modelTitle,
      hasOriginalImage: !!originalImage,
      imageName,
      imageType,
    });

    // 다음 파일 번호 가져오기
    const nextFileNumber = await getNextFileNumber(userId);

    // 폴더 이름 생성 (모델 번호를 폴더명으로 사용)
    const folderPrefix = `AI_3D_Models/${userId}/Ai3D_${nextFileNumber}`;

    // 파일 확장자 추출
    const fileExtension = fileName.includes(".")
      ? fileName.substring(fileName.lastIndexOf("."))
      : ".glb";

    // 모델 파일 키 생성
    const modelKey = `${folderPrefix}/model${fileExtension}`;

    // 파일 데이터 준비
    let fileBuffer: Buffer;
    if (modelFile instanceof File) {
      fileBuffer = Buffer.from(await modelFile.arrayBuffer());
    } else {
      fileBuffer = modelFile as Buffer;
    }

    console.log(
      `S3 모델 파일 업로드 시작 - 버킷: ${S3_BUCKET}, 키: ${modelKey}`
    );

    // 모델 파일 업로드
    const modelUploadResult = await s3v2
      .upload({
        Bucket: S3_BUCKET,
        Key: modelKey,
        Body: fileBuffer,
        ContentType: fileType || "model/gltf-binary",
        ACL: "public-read", // 퍼블릭 읽기 권한 설정
      })
      .promise();

    console.log("S3 모델 파일 업로드 완료:", modelUploadResult.Location);

    // 썸네일 이미지 URL (기본값 설정)
    let thumbnailUrl = modelUploadResult.Location.replace(
      fileExtension,
      ".jpg"
    );
    let imageUploadResult = null;

    // 원본 이미지가 있으면 업로드
    if (originalImage) {
      // 이미지 파일 키 생성
      const imageExtension = imageName.includes(".")
        ? imageName.substring(imageName.lastIndexOf("."))
        : ".jpg";
      const imageKey = `${folderPrefix}/image${imageExtension}`;

      // 이미지 파일 데이터 준비
      let imageBuffer: Buffer;
      if (originalImage instanceof File) {
        imageBuffer = Buffer.from(await originalImage.arrayBuffer());
      } else {
        imageBuffer = originalImage as Buffer;
      }

      console.log(
        `S3 이미지 파일 업로드 시작 - 버킷: ${S3_BUCKET}, 키: ${imageKey}`
      );

      // 이미지 파일 업로드
      imageUploadResult = await s3v2
        .upload({
          Bucket: S3_BUCKET,
          Key: imageKey,
          Body: imageBuffer,
          ContentType: imageType || "image/jpeg",
          ACL: "public-read", // 퍼블릭 읽기 권한 설정
        })
        .promise();

      console.log("S3 이미지 파일 업로드 완료:", imageUploadResult.Location);

      // 업로드된 이미지를 썸네일로 사용
      thumbnailUrl = imageUploadResult.Location;
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      url: modelUploadResult.Location,
      key: modelUploadResult.Key,
      title: `Ai3D_${nextFileNumber}`,
      fileNumber: nextFileNumber,
      viewerUrl: `/viewer?model=${encodeURIComponent(
        modelUploadResult.Location || ""
      )}`,
      fileName: `Ai3D_${nextFileNumber}${fileExtension}`,
      folderPath: folderPrefix,
      size: fileSize,
      lastModified: new Date().toISOString(),
      modelId: nextFileNumber,
      thumbnail: thumbnailUrl, // 원본 이미지 URL을 썸네일로 사용
      originalImage: imageUploadResult?.Location || null, // 원본 이미지 URL 포함
    });
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file",
        error: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

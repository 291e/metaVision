import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from "next";

// S3 설정
const S3_REGION = process.env.AWS_S3_REGION;
const S3_BUCKET = process.env.AWS_S3_BUCKET;

if (!S3_REGION || !S3_BUCKET) {
  throw new Error("Required AWS configuration is missing");
}

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "fileName과 fileType은 필수입니다." });
    }

    // 허용된 파일 타입 검증
    const allowedTypes = ["model/gltf-binary", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(fileType)) {
      return res
        .status(400)
        .json({ message: "지원하지 않는 파일 타입입니다." });
    }

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      // ACL 제거
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600, // 1시간
    });

    return res.status(200).json({ url });
  } catch (error) {
    console.error("Presigned URL 생성 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

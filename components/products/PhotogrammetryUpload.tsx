"use client";

import React, { useState, useEffect } from "react";
import { ObjectCannedACL, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { useMutation } from "@apollo/client";
import useUser from "@/app/hooks/useUser";
import { UPLOAD_PRODUCT_MUTATION } from "@/app/api/product/mutation";
import ReactConfetti from "react-confetti";
import { FaFolderOpen } from "react-icons/fa";

// S3 클라이언트 생성 (주의: 클라이언트에서 secret key 사용은 개발/테스트 환경에서만 사용)
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_LOCAL_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_LOCAL_SECRET_KEY!,
  },
});

const uploadFileToS3 = async (
  file: File,
  fileName: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: fileName,
      Body: file,
      ACL:
        (process.env.NEXT_PUBLIC_AWS_S3_PERMISSION as ObjectCannedACL) ||
        undefined,
      ContentType: file.type,
    },
    queueSize: 4,
    partSize: 5 * 1024 * 1024, // 5MB
    leavePartsOnError: false,
  });
  upload.on("httpUploadProgress", (progress) => {
    if (progress.total) {
      const percentage = (progress.loaded! / progress.total) * 100;
      onProgress(percentage);
    }
  });
  await upload.done();
  return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`;
};

const PhotogrammetryUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [showFanfare, setShowFanfare] = useState<boolean>(false);
  const { data: userData } = useUser();
  const userId = userData?.getMyInfo?.id || "anonymous";

  const [uploadMutation] = useMutation(UPLOAD_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      console.log("GraphQL mutation completed", data);
    },
    onError: (error) => {
      console.error("GraphQL mutation error", error);
      alert("모델 생성 중 에러가 발생했습니다.");
    },
  });

  // 업로드 완료 후 5초 뒤에 UI를 초기 상태로 되돌림
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploadComplete) {
      setShowFanfare(true);
      timer = setTimeout(() => {
        // 초기 상태로 리셋
        setFiles([]);
        setProgress(0);
        setUploadComplete(false);
        setShowFanfare(false);
        setTitle("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [uploadComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }
    if (!title) {
      alert("타이틀을 입력해주세요.");
      return;
    }
    setUploading(true);
    setUploadComplete(false);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.type === "image/png" ? "png" : "jpg";
        const relativePath = (file as any).webkitRelativePath;
        const fileName =
          relativePath && relativePath !== ""
            ? `${userId}/${title}/${relativePath}`
            : `${userId}/${title}/${i + 1}.${fileExtension}`;
        const url = await uploadFileToS3(file, fileName, (prog) => {
          const overallProgress = ((i + prog / 100) / files.length) * 100;
          setProgress(Math.round(overallProgress));
        });
        uploadedUrls.push(url);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      await uploadMutation({
        variables: {
          title,
          original_photo: uploadedUrls,
          alignment: true,
        },
      });
      setUploadComplete(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative p-4 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md w-full max-w-md">
      {/* Confetti 효과 */}
      {showFanfare && <ReactConfetti recycle={false} numberOfPieces={500} />}
      {!uploadComplete ? (
        <>
          {/* 타이틀 입력 */}
          {/* <input
            type="text"
            placeholder="타이틀 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 p-2  rounded w-full bg-transparent outline-none focus:border-transparent focus:ring-white"
          /> */}
          {/* 커스텀 파일 입력 UI */}
          <div className="mb-4 min-w-52">
            <label
              htmlFor="folder-input"
              className="px-6 border-2 rounded-md text-gray-500 cursor-pointer hover:text-white bg-[rgba(0,0,0,0.4)] border-dashed flex flex-col items-center justify-center p-6 min-w-52 transition"
            >
              <FaFolderOpen className="text-4xl text-gray-600  mb-2" />
              <span>폴더 불러오기</span>
              {files.length > 0 && (
                <span className="mt-2 text-green-600">
                  {files.length}개의 파일 선택됨
                </span>
              )}
            </label>
            <input
              id="folder-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {/* 업로드 버튼 */}
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full transition"
            disabled={uploading}
          >
            Photogrammetry 생성
          </button>
          {/* 진행률 표시 */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm">{progress}%</span>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 text-center">
          <div className="animate-bounce text-green-600 font-bold text-lg">
            3D 모델 생성이 완료되었습니다!
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotogrammetryUpload;

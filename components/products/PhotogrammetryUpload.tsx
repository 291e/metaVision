"use client";

import React, { useState, useEffect } from "react";
import { ObjectCannedACL, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { useMutation } from "@apollo/client";
import useUser from "@/app/hooks/useUser";
import { UPLOAD_PRODUCT_MUTATION } from "@/app/api/product/mutation";
import ReactConfetti from "react-confetti";
import { FaFolderOpen } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { FiUpload, FiRefreshCw, FiX, FiImage, FiCheck } from "react-icons/fi";
import { MdError } from "react-icons/md";

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
  const [error, setError] = useState<string | null>(null);
  const { data: userData } = useUser();
  const userId = userData?.getMyInfo?.id || "anonymous";

  const [uploadMutation] = useMutation(UPLOAD_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      console.log("GraphQL mutation completed", data);
    },
    onError: (error) => {
      console.error("GraphQL mutation error", error);
      setError("모델 생성 중 에러가 발생했습니다.");
    },
  });

  // 업로드 완료 후 5초 뒤에 UI를 초기 상태로 되돌림
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploadComplete) {
      setShowFanfare(true);
      timer = setTimeout(() => {
        // 초기 상태로 리셋
        resetForm();
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uploadComplete]);

  const resetForm = () => {
    setFiles([]);
    setProgress(0);
    setUploadComplete(false);
    setShowFanfare(false);
    setTitle("");
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 기존 로직을 복원하되 파일 타입 검사 추가
      const selectedFiles = Array.from(e.target.files);

      // 파일 타입 검사
      const invalidFiles = selectedFiles.filter(
        (file) => !file.type.includes("image/")
      );

      if (invalidFiles.length > 0) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setError(null);
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("업로드할 파일을 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      setError("타이틀을 입력해주세요.");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadComplete(false);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];

      // 각 파일마다 진행률 추적 (기존 기능 유지)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.type === "image/png" ? "png" : "jpg";
        const relativePath = (file as any).webkitRelativePath;
        const fileName =
          relativePath && relativePath !== ""
            ? `${userId}/${title}/${relativePath}`
            : `${userId}/${title}/${i + 1}.${fileExtension}`;

        // 원래 업로드 로직 복원
        const url = await uploadFileToS3(file, fileName, (fileProgress) => {
          // 개별 파일 진행률 처리 (원래 방식)
          const overallProgress =
            ((i + fileProgress / 100) / files.length) * 100;
          setProgress(Math.round(overallProgress));
        });

        uploadedUrls.push(url);
      }

      // 업로드 완료 표시
      setProgress(95);

      // GraphQL 뮤테이션 실행 (원래 로직)
      await uploadMutation({
        variables: {
          title,
          original_photo: uploadedUrls,
          alignment: true,
        },
      });

      // 모든 처리 완료
      setProgress(100);
      setUploadComplete(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {/* 상태 표시 바 */}
      {(uploading || error) && (
        <div className="w-full rounded-lg overflow-hidden bg-gray-200">
          {uploading && !error && (
            <>
              <div
                className={`h-2 bg-blue-500 progress-bar-${Math.floor(
                  progress
                )}`}
                style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
              ></div>
              <div className="text-center text-sm text-gray-700 py-1">
                {progress < 100
                  ? `업로드 중... ${Math.floor(progress)}%`
                  : "완료됨!"}
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 flex items-center">
              <MdError className="text-red-500 mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* 메인 UI 컨테이너 */}
      {!uploadComplete ? (
        <div className="p-6 rounded-xl bg-[rgba(0,0,0,0.3)] shadow-lg flex flex-col gap-4 w-full max-w-md border border-gray-700 h-full max-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">
              Photogrammetry 생성
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              다수의 이미지로 3D 모델을 생성합니다
            </p>
          </div>

          {/* 타이틀 입력 */}
          {/* <div className="relative">
            <input
              type="text"
              placeholder="타이틀 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md bg-transparent border border-blue-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* 파일 업로드 영역 */}
          {files.length === 0 ? (
            <label className="border-2 border-dashed border-blue-300 rounded-lg text-gray-300 cursor-pointer hover:text-blue-300 hover:border-blue-500 bg-[rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-8 transition-all duration-200">
              <FiUpload className="text-4xl text-blue-400 mb-3" />
              <span className="font-medium">이미지 업로드</span>
              <span className="text-xs text-gray-500  mt-1">
                JPG, PNG (여러 장의 이미지 선택)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="border border-blue-300 rounded-lg p-4 bg-[rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiImage className="text-blue-500 mr-2" size={20} />
                  <span className="text-white font-medium">선택된 이미지</span>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500 font-bold">
                  {files.length}장
                </span>
                <span className="text-gray-400 text-sm">
                  {files.length >= 10 ? (
                    <span className="text-green-500 flex items-center">
                      <FiCheck size={16} className="mr-1" /> 충분한 이미지
                    </span>
                  ) : (
                    <span className="text-yellow-500">10장 이상 권장</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                처리 중...
              </>
            ) : (
              <>Photogrammetry 생성</>
            )}
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[rgba(0,0,0,0.3)] shadow-lg flex flex-col gap-4 w-full max-w-md border border-green-700">
          <div className="text-center">
            <div className="animate-bounce">
              <FiCheck className="text-green-500 text-4xl mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              3D 모델 생성 요청 완료
            </h3>
            <p className="text-gray-300 text-sm mt-2">
              요청이 처리되었습니다. 생성된 모델은 곧 확인하실 수 있습니다.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-4 transition"
          >
            새 모델 생성하기
          </button>

          {/* Confetti 효과 */}
          {showFanfare && (
            <ReactConfetti recycle={false} numberOfPieces={500} />
          )}
        </div>
      )}
    </div>
  );
};

export default PhotogrammetryUpload;

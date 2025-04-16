"use client";

import React, { useState } from "react";
import Slide from "@/lib/swiper"; // 기존 전체 상품 슬라이드 컴포넌트
import AiModelSlide from "@/components/products/AiModelSlide"; // AI 3D 모델 슬라이드 컴포넌트 추가 (나중에 생성)

type TabType = "all" | "mine" | "ai3d";

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <div className="pb-4 relative">
      {/* 탭 헤더 */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "all"
              ? "border-blue-500 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "mine"
              ? "border-blue-500 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("mine")}
        >
          나의 자산
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "ai3d"
              ? "border-blue-500 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("ai3d")}
        >
          AI 3D 모델
        </button>
      </div>
      {/* 탭 내용 */}
      <div className="mx-auto">
        {activeTab === "all" ? (
          <Slide />
        ) : activeTab === "mine" ? (
          <></>
        ) : (
          <AiModelSlide />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;

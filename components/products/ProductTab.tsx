"use client";

import React, { useState } from "react";
import Slide from "@/lib/swiper"; // 기존 전체 상품 슬라이드 컴포넌트
import MyAssetsSlide from "@/components/products/MyAssetsSlide";

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

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
      </div>
      {/* 탭 내용 */}
      <div className="mx-auto">
        {activeTab === "all" ? <Slide /> : <MyAssetsSlide />}
      </div>
    </div>
  );
};

export default ProductTabs;

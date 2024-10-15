"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function Chat() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const videoUrls = [
    "https://www.youtube.com/watch?v=DAOa8fN15-I",
    "https://www.youtube.com/watch?v=ZglJ1XbsNzQ",
  ];

  if (!isMounted) {
    return null; // 초기 렌더링에서 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex items-center w-full justify-center py-20 bg-gradient-to-b from-[#7FC6FE] to-[#8481FE]">
      <div className="flex flex-col gap-20 w-[500px] h-[700px] px-10 md:w-[700px] md:h-[750px]">
        {videoUrls.map((url, index) => (
          <div
            key={index}
            className="relative w-full h-0 shadow-md"
            style={{
              paddingBottom: "56.25%",
              borderRadius: "20px",
              overflow: "hidden",
            }} // 16:9 비율 유지
          >
            <ReactPlayer
              key={index}
              url={url}
              style={{ borderRadius: "20px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

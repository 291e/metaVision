// components/Skeleton.tsx
"use client";

import React from "react";

const Skeleton: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "100%",
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${width} ${height}`}
    ></div>
  );
};

export default Skeleton;

import React from "react";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" text-black pt-[80px] lg:pt-[94px] bg-white">
      {children}
    </div>
  );
}

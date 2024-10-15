import React from "react";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pt-20 text-black">{children}</div>;
}

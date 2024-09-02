import React, { Suspense } from "react";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <div className="h-full dark:bg-[#1F1F1F]">
        <Navbar />
        <main className="h-full pt-40 ">{children}</main>
      </div>
    </Suspense>
  );
};

export default MarketingLayout;

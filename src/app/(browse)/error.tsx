"use client";

import Link from "next/link";
import React from "react";

interface ErrorPageProps {
  err?: {
    message?: string;
  };
}

export default function ErrorPage({ err }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center font-sans text-[#333]">
      <h1 className="mb-2.5 text-5xl font-bold text-[#0070f3]">Oops!</h1>
      <p className="mb-5 text-xl">{err?.message}</p>
      
      <div className="mt-5 flex items-center justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-[#0070f3] px-5 py-2.5 text-white transition-colors hover:bg-blue-700 cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="text-[#0070f3] hover:underline"
        >
          Go Home
        </Link>
      </div>

      <p className="mt-[30px] text-sm text-[#666]">Error Code: 500</p>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[APP_ERROR]:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">
        Something went wrong!
      </h2>
      <p className="text-sm text-slate-500 max-w-md">
        We couldn&apos;t load this section right now. Please try again.
      </p>
      <div className="flex gap-x-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
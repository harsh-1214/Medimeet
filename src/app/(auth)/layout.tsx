import React from "react";
import { Logo } from "../_components/Navbar/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-3">
        {/* <Logo/> */}
        {children}
    </div>
  );
}

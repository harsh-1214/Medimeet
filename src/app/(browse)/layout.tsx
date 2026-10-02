import React from "react";
import { Navbar } from "../_components/Navbar";
// import { Navbar } from "./_components/Navbar";

export default function BrowserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/container";
import { Navbar } from "@/app/_components/Navbar";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="flex h-full" suppressHydrationWarning>
        <Sidebar />
        <Container>
          <Navbar />
          {children}
        </Container>
      </div>
  );
}

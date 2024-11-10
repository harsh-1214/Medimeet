import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/container";
import { Navbar } from "./_components/Navbar";
import { getSelf } from "@/lib/auth-service";
import { redirect } from "next/navigation";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const self = await getSelf();
  if(!self){
    redirect('/sign-in')
  }

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

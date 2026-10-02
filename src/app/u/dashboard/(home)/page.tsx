import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DashBoardPage = async () => {

  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role?.toLowerCase();

  if (role === "doctor") {
    redirect("/u/dashboard/scheduled_appointments");
  } else if(role === 'patient') {
    redirect("/u/dashboard/upcoming_Appointments");
  }

  return <div>DashBoardPage</div>;
};

export default DashBoardPage;

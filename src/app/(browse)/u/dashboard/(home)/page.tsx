import { getSelf } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import React from "react";

const DashBoardPage = async () => {
  const user = await getSelf();
  if (!user) {
    redirect("/sign-in");
  }
  if (user.role?.toLowerCase() === "doctor") {
    redirect("/u/dashboard/scheduled_appointments");
  } else if (user.role?.toLowerCase() === "patient") {
    redirect("/u/dashboard/upcoming_Appointments");
  }

  return <div>DashBoardPage</div>;
};

export default DashBoardPage;

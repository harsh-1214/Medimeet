import Component from "../_components/upComingHistoryBlock";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAppointmentsByStatus } from "@/lib/appointment-service";

const UpcomingAppointments = async () => {
  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role?.toLowerCase();

  if (role !== "patient") {
    redirect("/u/dashboard");
  }

  const appointments = await getAppointmentsByStatus("scheduled");

  return (
    <div>
      <Component appointments={appointments} title={"Upcoming Appoinments"} />
    </div>
  );
};

export default UpcomingAppointments;

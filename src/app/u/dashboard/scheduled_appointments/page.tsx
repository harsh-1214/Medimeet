import { getDoctorsAppointments } from "@/actions/doctor";
import React from "react";
import ScheduledAppointmentsComponent from "../_components/scheduledAppointments";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const ScheduledAppointments = async () => {

  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role?.toLowerCase();

  if(role !== 'doctor'){
    redirect('/u/dashboard');
  }

  const appointments = await getDoctorsAppointments("Scheduled");

  return (
    <div>
      <ScheduledAppointmentsComponent
        appointments={appointments}
        title={"Scheduled Appoinments"}
      />
    </div>
  );
};

export default ScheduledAppointments;

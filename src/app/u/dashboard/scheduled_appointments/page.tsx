import React from "react";
import ScheduledAppointmentsComponent from "../_components/scheduledAppointments";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAppointmentsByStatusOfDoctor } from "@/lib/appointment-service";

const ScheduledAppointments = async () => {

  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role?.toLowerCase();

  if(role !== 'doctor'){
    redirect('/u/dashboard');
  }

  const appointments = await getAppointmentsByStatusOfDoctor("scheduled");

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

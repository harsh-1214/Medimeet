import { getDoctorsAppointments } from "@/actions/doctor";
import { Appointment } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ScheduledAppointmentsComponent from "../_components/scheduledAppointments";
import { getUserInfo } from "@/actions/user";
import { setCookie } from "cookies-next";

const ScheduledAppointments = async () => {

  // Solve Hydration errors

  // let appointments: ({
  //   patient: {
  //     user: {
  //       first_name: string;
  //       last_name: string;
  //     };
  //   };
  // } & Appointment)[];

  // try {
    
  //   setCookie('role','doctor');
  // } catch {
  //   console.error("Please Login First");
  //   redirect("/sign-in");
  // }

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

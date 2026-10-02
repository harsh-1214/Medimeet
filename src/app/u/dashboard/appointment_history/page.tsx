import Component from "../_components/upComingHistoryBlock";
import ScheduledAppointmentsComponent from "../_components/scheduledAppointments";
import { getDoctorsAppointments } from "@/actions/doctor";
import { auth } from "@clerk/nextjs/server";
import { getAppointmentsByStatus } from "@/lib/appointment-service";



export default async function AppointmentHistory(){

    const {sessionClaims} = auth();
    const role = sessionClaims?.metadata?.role?.toLowerCase();
   

    if(role === 'patient'){
        const appointments = await getAppointmentsByStatus("completed");
        return (
            <div>
                <Component appointments = {appointments} title = {'Appointment History'}/>
            </div>
        );
    }
    else{
        const doctorAppointments = await getDoctorsAppointments('completed');
        return (
            <div>
                <ScheduledAppointmentsComponent appointments={doctorAppointments} title="Appointment History"/>
            </div>
        )
    }


    

}
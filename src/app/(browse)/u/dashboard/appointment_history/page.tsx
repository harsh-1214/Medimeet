import { getAppointments } from "@/actions/bookAppointment";
import Component from "../_components/upComingHistoryBlock";
import { getSelf } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import ScheduledAppointmentsComponent from "../_components/scheduledAppointments";
import { getDoctorsAppointments } from "@/actions/doctor";
import { setCookie } from "cookies-next";
import { auth } from "@clerk/nextjs/server";



export default async function AppointmentHistory(){


    // const self = await getSelf();
    // if(!self){
    //     redirect('/sign-in')
    // }

    // if(!self.role){
    //     redirect('/profile-setup')
    // }
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role?.toLowerCase();
    if(!role){
        console.error('Please Setup Your Profile First')
        redirect('/profile-setup')
    }

    if(role === 'patient'){
        const appointments = await getAppointments("Completed");
        return (
            <div>
                <Component appointments = {appointments} title = {'Appointment History'}/>
            </div>
        );
    }
    else{
        const doctorAppointments = await getDoctorsAppointments('Completed');
        return (
            <div>
                <ScheduledAppointmentsComponent appointments={doctorAppointments} title="Appointment History"/>
            </div>
        )
    }


    

}
import { getAppointments } from "@/actions/bookAppointment";
import Component from "../_components/upComingHistoryBlock";
import { redirect } from "next/navigation";
import { Appointment } from "@prisma/client";


const UpcomingAppointments = async() => {

    // Solve Hydration errors

    let appointments : ({
        doctor: {
            user: {
                first_name: string;
                last_name: string;
            };
        };
      } & Appointment )[];

    try{
        appointments = await getAppointments("Scheduled");
    }
    catch{
        console.error('Please Login First')
        redirect('/sign-in')
    }

    return (

        <div>
            <Component appointments = {appointments} title = {'Upcoming Appoinments'}/>
        </div>

    );

}

export default UpcomingAppointments;
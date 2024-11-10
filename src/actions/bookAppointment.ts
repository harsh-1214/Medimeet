'use server'

import { getAppointmentsByStatus } from "@/lib/appointment-service"
import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface bookMyAppointmentArgs{
    reason : string,
    AppointmentDateTime : Date,
    doctorId : string
}

export const bookMyAppointment = async ( {reason,AppointmentDateTime,doctorId} :  bookMyAppointmentArgs) => {

   try {
     const self = await getSelf();
 
     if(!self || !self.patient?.id){
         throw new Error('Please Login First')
     }
 
     const room = await db.room.create({data : {}});
 
     const response = await db.appointment.create( {
         data : {
             patientId : self.patient.id,
             doctorId,
             AppointmentDateTime,
             reason,
             roomId : room.id
         }
     })

     revalidatePath('/u/dashboard/scheduled_appointments');
     revalidatePath('/u/dashboard/upcoming_Appointments');

     return response.id
   } catch (err) {
        throw new Error('Internal Server Error')
   }
}

export const getAppointments = async (status : string) => {

    try {
        const appointments = await getAppointmentsByStatus(status);
    
        revalidatePath('/u/dashboard/appointment_history')
    
        return appointments;
    } catch (err : any) {
        throw new Error('Internal Server Error')
    }
}
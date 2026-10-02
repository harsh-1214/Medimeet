'use server'

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
             status : 'scheduled',
             roomId : room.id
         }
     })

     revalidatePath('/u/dashboard/upcoming_Appointments');
    
     return response.id
   } catch (errors : any) {
        throw new Error( errors?.message || 'Internal Server Error')
   }
}
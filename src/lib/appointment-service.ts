import { getSelf } from "./auth-service"
import { db } from "./db";


export const getAppointmentsByStatus =  async (status : string) => {

    const self = await getSelf();

    // Catch the error here if you want of User nor found

    if(self.doctor?.id){
        throw new Error('Doctor Cannot Book appointments')
    }

    if(!self.patient?.id){
        // User is not Logged in
        throw new Error('Please Login First');
    }

    const appointments = await db.appointment.findMany({
        where : {
            patientId : self.patient.id,
            status,
        },
        include : {
            doctor : {
                select : {
                    user : {
                        select : {
                            first_name : true,
                            last_name : true,
                        }
                    }
                }
            },
        }
    })

    return appointments
}


export const getAppointmentsByStatusOfDoctor =  async (status : string) => {

    const self = await getSelf();

    // Catch the error here if you want of User nor found

    
    if(self.patient?.id){
        // User is not Logged in
        throw new Error('Patient Cannot Schedule Appointments');
    }

    if(!self.doctor?.id){
        throw new Error('Please Login First')
    }

    const appointments = await db.appointment.findMany({
        where : {
            doctorId : self.doctor.id,
            status,
        },
        include : {
            patient : {
                select : {
                    user : {
                        select : {
                            first_name : true,
                            last_name : true,
                        }
                    }
                }
            }
        }
    })

    return appointments
}


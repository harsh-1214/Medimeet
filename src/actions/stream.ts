'use server'

import { db } from "@/lib/db"


export const getPeerId = async(roomId : string,isDoctor : boolean) => {

    const room = await db.room.findUnique({where : {id : roomId}})

    if(!room){
        throw new Error('Room Not Found')
    }

    return isDoctor ? room.patientPeerId : room.doctorPeerId;
}

export const setPeerIdinDb = async(peerId : string,roomId : string,isDoctor : boolean) => {

    const updateField = isDoctor ? 'doctorPeerId' : 'patientPeerId' ;

    await db.room.update({
        where : {
            id : roomId,
        },
        data : {
            [updateField] : peerId,
        }
    })

}

export async function isDoctorByExternalId (id : string | null | undefined){

    if(!id) return;

    const user = await db.user.findUnique({
        where : {
            externalUserId : id,
        },
        select : {
            role : true,
        }
    })
    console.log(user)

    if(!user || !user?.role){
        throw new Error('User Not Found')
    }

    return user.role;
}

export const updateAppointmentStatus = async(roomId : string) => {

    try {
        await db.appointment.update({
            where : {
                roomId,
            },
            data : {
                status : 'completed'
            }
        })
    } catch (err) {
        console.log('Internal Server Error');
    }

}

export const addAppointmentPrescription = async(id : string,url : string) => {

    try {
            await db.appointment.update({
                where : {
                    id,
                },
                data : {
                    prescriptionUrl : url
                }
            })        
    } catch (err) {
        console.log('Internal Server Error');
    }
} 

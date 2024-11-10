import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req : NextRequest){

    try {
        const {roomId,isDoctor} = await req.json();
        const updateField = isDoctor ? 'doctorPeerId' : 'patientPeerId' ;
    
        await db.room.update({
            where : {
                id : roomId,
            },
            data : {
                [updateField] : null,
            }
        })
        return NextResponse.json({success : true});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success : false});
    }

}
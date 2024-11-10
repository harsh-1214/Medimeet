import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { z } from 'zod';

const bodySchema = z.object({
  peerId: z.string(),
  roomId : z.string(),
  isDoctor : z.boolean(),
});

export async function POST (req : NextRequest){

    try {
        const {peerId,roomId,isDoctor} = await req.json();
        const updateField = isDoctor ? 'doctorPeerId' : 'patientPeerId' ;
    
        await db.room.update({
            where : {
                id : roomId,
            },
            data : {
                [updateField] : peerId,
            }
        })
        revalidatePath(`/stream/${roomId}`);
        return NextResponse.json({success : true,peerId});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success : false});
    }

}
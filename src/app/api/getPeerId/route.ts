import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomId, isDoctor } = await req.json();

    const room = await db.room.findUnique({ where: { id: roomId } });

    if (!room) {
      throw new Error("Room Not Found");
    }

    const otherPeerId = isDoctor === true ? room.patientPeerId : room.doctorPeerId;

    return NextResponse.json({success : true,peerId : otherPeerId});
  } catch (err) {
    console.log(err)
    return NextResponse.json({success : false});
  }
}

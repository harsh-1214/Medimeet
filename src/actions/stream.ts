"use server";

import { safeAction } from "@/lib/action-utils";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getPeerId = async (roomId: string, isDoctor: boolean) =>
  safeAction("GET_PEER_ID", async () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const room = await db.room.findUnique({
      where: { id: roomId },
      select: {
        patientPeerId: true,
        doctorPeerId: true,
      },
    });

    if (!room) {
      throw new Error("Video consultation room not found.");
    }

    return isDoctor ? room.patientPeerId : room.doctorPeerId;
  });

export const setPeerIdinDb = async (
  peerId: string,
  roomId: string,
  isDoctor: boolean,
) =>
  safeAction("SET_PEER_ID", async () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const updateField = isDoctor ? "doctorPeerId" : "patientPeerId";

    await db.room.update({
      where: { id: roomId },
      data: { [updateField]: peerId },
    });

    return true;
  });

export const updateAppointmentStatus = async (roomId: string) =>
  safeAction("UPDATE_APPOINTMENT_STATUS", async () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await db.appointment.update({
      where: { roomId },
      data: { status: "completed" },
    });

    revalidatePath("/u/dashboard/upcoming_Appointments");
    revalidatePath("/u/dashboard/appointment_history");

    return true;
  });

export const addAppointmentPrescription = async (id: string, url: string) =>
  safeAction("ADD_PRESCRIPTION", async () => {
    const { userId} = auth();
    if (!userId) throw new Error("Unauthorized");

    if (!url || !url.trim()) {
      throw new Error("Invalid prescription URL.");
    }

    await db.appointment.update({
      where: { id },
      data: { prescriptionUrl: url.trim() },
    });

    revalidatePath("/u/dashboard/appointment_history");

    return true;
  });
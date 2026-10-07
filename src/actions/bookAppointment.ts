// actions/appointment.ts
"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { safeAction } from "@/lib/action-utils"; 
import { revalidatePath } from "next/cache";

interface BookMyAppointmentArgs {
  reason: string;
  AppointmentDateTime: Date;
  doctorId: string;
}

export const bookMyAppointment = async ({
  reason,
  AppointmentDateTime,
  doctorId,
}: BookMyAppointmentArgs) =>
  safeAction("BOOK_APPOINTMENT", async () => {
    const self = await getSelf();

    if (self.doctor?.id) {
      throw new Error("Doctors cannot book appointments.");
    }

    if (!self.patient?.id) {
      throw new Error("Please complete your patient profile first.");
    }

    const response = await db.$transaction(async (tx) => {
      const room = await tx.room.create({ data: {} });

      return await tx.appointment.create({
        data: {
          patientId: self.patient!.id,
          doctorId,
          AppointmentDateTime,
          reason: reason.trim(),
          status: "scheduled",
          roomId: room.id,
        },
      });
    });

    revalidatePath("/u/dashboard/upcoming_Appointments");

    // safeAction automatically wraps this into { success: true, data: response.id }!
    return response.id;
  });
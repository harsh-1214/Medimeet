import { getSelf } from "./auth-service";
import { db } from "./db";

// Define valid statuses so TypeScript catches typos immediately
export type AppointmentStatus = "scheduled" | "completed";

export const getAppointmentsByStatus = async (status: AppointmentStatus | string) => {
  // 1. getSelf() automatically throws "Please Login First!" if unauthenticated
  const self = await getSelf();

  if (self.doctor?.id) {
    throw new Error("Unauthorized: Doctors cannot view the patient appointments page.");
  }

  if (!self.patient?.id) {
    throw new Error("Patient profile not found. Please complete your profile setup.");
  }

  const appointments = await db.appointment.findMany({
    where: {
      patientId: self.patient.id,
      status: status.toLowerCase(),
    },
    include: {
      doctor: {
        select: {
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
    // 2. Sort appointments chronologically
    orderBy: {
      AppointmentDateTime: "asc",
    },
  });

  return appointments;
};

export const getAppointmentsByStatusOfDoctor = async (status: AppointmentStatus | string) => {
  const self = await getSelf();

  if (self.patient?.id) {
    throw new Error("Unauthorized: Patients cannot access the doctor schedule.");
  }

  if (!self.doctor?.id) {
    throw new Error("Doctor profile not found. Please complete your profile setup.");
  }

  const appointments = await db.appointment.findMany({
    where: {
      doctorId: self.doctor.id,
      status: status.toLowerCase(),
    },
    include: {
      patient: {
        select: {
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
    orderBy: {
      AppointmentDateTime: "asc",
    },
  });

  return appointments;
};
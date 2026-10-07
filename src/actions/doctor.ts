"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { Doctor } from "@prisma/client";

export const updateDoctorDetails = async (values: Partial<Doctor>) => {
  const self = await getSelf();

  if (!self || !self.doctor?.id) {
    throw new Error("Unauthorized");
  }

  const doctorUser = await db.doctor.findUnique({
    where: { id: self.doctor.id },
  });

  if (!doctorUser) {
    throw new Error("Unauthorized");
  }

  const updatedDoctor = await db.doctor.update({
    where: {
      id: self.doctor.id,
    },
    data: {
      qualification: values.qualification,
      awards: values.awards,
      imageUrl: values.imageUrl,
      experience: values.experience,
      PhoneNo: values.PhoneNo,
      fees : values.fees,
      gender : values.gender,
      specializations : values.specializations,
    },
  });

  return {success : true};
};

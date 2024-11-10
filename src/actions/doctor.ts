"use server";

import { getAppointmentsByStatusOfDoctor } from "@/lib/appointment-service";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { getAllDoctors } from "@/lib/doctor-service";
import { Doctor } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface queryParamsInfo {
  fees?: string;
  Experience?: string;
  q?: string;
  gender?: string;
  page? : string;
}

export const getDoctors = async ({
  queryParams,
}: {
  queryParams: queryParamsInfo;
}) => {
  try {
    // console.log()
    const doctors = await getAllDoctors(queryParams);
    revalidatePath("/search");
    return doctors;
  } catch (err: any) {
    // return {message : 'Internal Server Error',success : false,err : err}
    throw new Error("Internal Server Error!!");
    // console.log(err.stack)
    // console.log('Internal Server Error')
  }
};

export const getDoctorsAppointments = async (status: string) => {
  try {
    const appointments = await getAppointmentsByStatusOfDoctor(status);

    revalidatePath("/u/dashboard");
    revalidatePath("/u/dashboard/scheduled_appointments");

    return appointments;
  } catch (err: any) {
    throw new Error("Internal Server Error");
  }
};

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


export const getDoctorProfile = async (doctorId : string) => {

  try{
    const doctor = await db.doctor.findUnique({where : {id : doctorId} , include : {user : true}});
    if(!doctor){
      throw new Error('User not Found');
    }
    return doctor;
  }
  catch(err){
    throw new Error("Internal Server Error")
  }
}
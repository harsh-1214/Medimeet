"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {setCookie} from 'cookies-next'

// export const updatePatientProfile = async (values: Partial<Patient>) => {
//   try {
//     const self = await getSelf();

//     if (!self) {
//       throw new Error("Unauthorized");
//     }
//     const oldPatient = await db.patient.findUnique({
//       where: {
//         id: self.patient?.id,
//       },
//     });

//     if (!oldPatient) {
//       throw new Error("Unauthorized");
//     }

//     const newPatient = await db.patient.update({
//       where: {
//         id: oldPatient.id,
//       },
//       data: {
//         email: values.email,
//         first_name: values.first_name,
//         last_name: values.last_name,
//       },
//     });

//     revalidatePath("/u/dashboard/edit_profile");
//     return { success: true };
//   } catch (err: any) {
//     throw new Error("Internal Server error ");
//   }
// };

export const getUserProfile = async () => {
  const self = await getSelf();

  if (!self) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: {
      id: self.id,
    },
    select: {
      email: true,
      first_name: true,
      last_name: true,
    },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};

const userSchema = z.object({
  qualification: z.array(
    z.string({ message: "Qualifications Cannot be empty!" })
  ),
  specializations: z.array(
    z.string({ message: "Specialization Cannot be empty" })
  ),
  experience: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Must be a numeric string",
  }),
  awards: z.array(z.string({ message: "Awards Cannot be empty!" })),
  imageUrl: z.string({ message: "Please Upload Your Profile Picture" }),
  gender: z.enum(["male", "female"]),
  fees: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Must be a numeric string",
  }),
  bio: z.string({ message: "Bio Cannot be empty!" }),
});

const roleSchema = z.object({
  role: z.enum(["doctor", "patient"], {
    message: "Role must be one of the following",
  }),
});

export const updateUserProfile = async ({
  qualification,
  experience,
  awards,
  fees,
  gender,
  PhoneNo,
  imageUrl,
  specializations,
  role,
  bio,
}: {
  specializations: string[];
  fees: string;
  gender: string;
  qualification: string[];
  experience: string;
  awards: string[];
  PhoneNo: string;
  imageUrl: string;
  role: string;
  bio: string;
}) => {
  // Check Zod validation if you want
  const result = roleSchema.safeParse({ role });

  try {
    const self = await getSelf();

    if (result.success && role === "patient") {
      // Create patient record
      await db.patient.create({
        data: {
          userId: self.id,
        },
      });

      // Update User Record
      await db.user.update({
        where: {
          id: self.id,
        },
        data: {
          role,
        },
      });
    } else if (result.success && role === "doctor") {
      // Create Doctor Record

      const result = userSchema.safeParse({
        qualification,
        gender,
        fees,
        specializations,
        awards,
        experience,
        PhoneNo,
        imageUrl,
      });

      if (result.success) {
        await db.doctor.create({
          data: {
            qualification,
            gender,
            fees: Number(fees),
            specializations,
            awards,
            experience: Number(experience),
            PhoneNo,
            imageUrl,
            userId: self.id,
            bio,
          },
        });

        // Update User Record
        await db.user.update({
          where: {
            id: self.id,
          },
          data: {
            role,
          },
        });
      } else {
        throw new Error(result.error?.message);
      }
    } else {
      throw new Error(result.error?.message);
    }

    setCookie('role',role,{expires : new Date('2024-07-09T12:00:09.451Z')});

    revalidatePath("/search");
  } catch (err: any) {
    throw new Error("Internal Server Error");
  }
};

export const getUserInfo = async () => {
  try {
    const self = await currentUser();
    
    if (!self || !self.id) {
      throw new Error("Please Login First!");
    }
  
    const user = await db.user.findUnique({
      where: {
        externalUserId: self.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
          },
        },
        patient: {
          select: {
            id: true,
          },
        },
      },
    });

    console.log(user)
  
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err : any) {
    throw new Error('Please Login First')
  }
};

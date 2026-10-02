"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { setCookie } from "cookies-next";
import { clerkClient } from "@clerk/nextjs/server";
import { roleSchema, userSchema } from "@/lib/validations";
import { cookies } from "next/headers";

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

export type ProfileInput = {
  role: string;
  qualification?: string[];
  specializations?: string[];
  experience?: string;
  awards?: string[];
  imageUrl?: string;
  gender?: string; // Now the server accepts it if it's missing for a patient
  fees?: string;
  bio?: string;
  PhoneNo?: string;
};

export const updateUserProfile = async (data: ProfileInput) => {
  try {
    const self = await getSelf();
    if (!self) {
      return { success: false, error: "Unauthorized access" };
    }

    const roleResult = roleSchema.safeParse({ role: data.role });
    if (!roleResult.success) {
      return { success: false, error: roleResult.error.issues[0].message };
    }

    if (data.role === "patient") {
      // Prisma Transaction: Ensures both actions succeed or both roll back
      await db.$transaction([
        db.patient.create({
          data: { userId: self.id },
        }),
        db.user.update({
          where: { id: self.id },
          data: { role: data.role },
        }),
      ]);
    } else if (data.role === "doctor") {
      const result = userSchema.safeParse(data);
      if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
      }

      await db.$transaction([
        db.doctor.create({
          data: {
            qualification: data.qualification,
            gender: data.gender,
            fees: Number(data.fees),
            specializations: data.specializations,
            awards: data.awards,
            experience: Number(data.experience),
            PhoneNo: data.PhoneNo,
            imageUrl: data.imageUrl,
            bio: data.bio,
            userId: self.id,
          },
        }),
        db.user.update({
          where: { id: self.id },
          data: { role: data.role },
        }),
      ]);
    }

    // Next.js 14 specific: cookies() is synchronous here.
    // (In Next.js 15, this would throw an error requiring `await cookies()`)
    cookies().set("role", data.role, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(self.externalUserId, {
      publicMetadata: {
        onboardingComplete: true,
        role: data.role,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Profile Setup Error:", err);

    // Catch database unique constraint errors (e.g., user already has a profile)
    if (err.code === "P2002") {
      return {
        success: false,
        error: "A profile already exists for this user.",
      };
    }

    // Return a clean fallback error to the client instead of crashing Next.js
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
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

    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err: any) {
    throw new Error("Please Login First");
  }
};

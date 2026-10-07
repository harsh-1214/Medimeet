"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { roleSchema, userSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { safeAction } from "@/lib/action-utils";

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

//     const newPatient = await db.user.update({
//       where: {
//         id: oldPatient.id,
//       },
//       data: {
//         // email: values.email,
//         // first_name: values.first_name,
//         // last_name: values.last_name,
//       },
//     });

//     revalidatePath("/u/dashboard/edit_profile");
//     return { success: true };
//   } catch (err: any) {
//     throw new Error("Internal Server error ");
//   }
// };

// export const getUserProfile = async () => {
//   const self = await getSelf();

//   if (!self) {
//     throw new Error("Unauthorized");
//   }
//   const user = await db.user.findUnique({
//     where: {
//       id: self.id,
//     },
//     select: {
//       email: true,
//       first_name: true,
//       last_name: true,
//     },
//   });

//   if (!user) {
//     throw new Error("Unauthorized");
//   }
//   return user;
// };

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

export const updateUserProfile = async (data: ProfileInput) =>
  safeAction("UPDATE_USER_PROFILE", async () => {
    // 1. getSelf() automatically throws "Please Login First!" if unauthenticated
    const self = await getSelf();

    // 2. Prevent duplicate profiles immediately using getSelf() relations
    if (self.patient?.id || self.doctor?.id) {
      throw new Error("A profile already exists for this user.");
    }

    // 3. Validate role with Zod
    const roleResult = roleSchema.safeParse({ role: data.role });
    if (!roleResult.success) {
      throw new Error(roleResult.error.issues[0].message);
    }

    // 4. Create role-specific profile inside an atomic transaction
    if (data.role === "patient") {
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
        throw new Error(result.error.issues[0].message);
      }

      await db.$transaction([
        db.doctor.create({
          data: {
            qualification: data.qualification,
            gender: data.gender,
            fees: Number(data.fees),
            specializations: data.specializations?.map((s) => s.toLowerCase()),
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

    // 5. Set role cookie (use NODE_ENV check so cookies work on http://localhost too)
    cookies().set("role", data.role, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // 6. Sync onboarding status to Clerk
    await clerkClient.users.updateUserMetadata(self.externalUserId, {
      publicMetadata: {
        onboardingComplete: true,
        role: data.role,
      },
    });

    return true;
  });

// export const getUserInfo = async () => {
//   try {
//     const self = await currentUser();

//     if (!self || !self.id) {
//       throw new Error("Please Login First!");
//     }

//     const user = await db.user.findUnique({
//       where: {
//         externalUserId: self.id,
//       },
//       include: {
//         doctor: {
//           select: {
//             id: true,
//           },
//         },
//         patient: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     console.log(user);

//     if (!user) {
//       throw new Error("User not found");
//     }
//     return user;
//   } catch (err: any) {
//     throw new Error("Please Login First");
//   }
// };

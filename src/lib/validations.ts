// lib/validations.ts
import { z } from "zod";

export const userSchema = z.object({
  qualification: z
    .array(z.string().trim())
    .transform((arr) => arr.filter((s) => s.length > 0)) // remove empty strings
    .refine((arr) => arr.length > 0, {
      message: "Please enter at least one qualification",
    }),

  specializations: z
    .array(z.string().trim().min(1, "Specialization cannot be empty!"))
    .min(1, "Please select your specialization!"),

  experience: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Experience must be a valid number",
  }),

  awards: z
    .array(z.string().trim())
    .transform((arr) => arr.filter((s) => s.length > 0)) // remove empty strings
    .refine((arr) => arr.length > 0, {
      message: "Please enter at least one award or certification!",
    }),

  imageUrl: z
    .string()
    .min(1, "Please upload your profile picture")
    .url("Invalid image URL"),

  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select your gender" }),
  }),

  fees: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Consultation fees must be a valid number",
  }),

  bio: z.string().trim().min(1, "Bio cannot be empty!"),

  PhoneNo: z.string().optional(),
});

export const roleSchema = z.object({
  role: z.enum(["doctor", "patient"], {
    errorMap: () => ({ message: "Please select a role (Doctor or Patient)" }),
  }),
});

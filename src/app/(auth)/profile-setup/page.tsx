"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/actions/user";
import { CldUploadButton } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import { z } from "zod";
import { doctorSpecializations } from "@/lib/constants";

const ProfileSetup = () => {
  const [role, setRole] = useState("");
  const debounced = useDebounceCallback(handleArrayChange, 500);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    specializations: [],
    fees: '',
    gender: "",
    qualification: [],
    experience: '',
    awards: [],
    PhoneNo: "",
    imageUrl: "",
    bio : '',
  });

  function handleChangeRole(val: string) {
    setRole(val);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    handleInputs(value, name);
  }

  function handleInputsArray(val: string, name: string) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: val.split(","), // Split lines into an array
    }));
  }

  function handleArrayChange(e: ChangeEvent<HTMLTextAreaElement>) {

    const { value, name } = e.target;
    if(name === 'bio'){
      handleInputs(value,name);
      return;
    }
    handleInputsArray(value, name);
  }
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
    gender: z.enum(["male", "female"], {
      message: "Gender must be either male or female",
    }),
    fees: z.string().refine((value) => /^\d+$/.test(value), {
      message: "Must be a numeric string",
    }),
    bio : z.string({ message: "Bio Cannot be empty!" }),
  });

  const roleSchema = z.object({
    role: z.enum(["doctor", "patient"], {
      message: "Role must be one of the following",
    }),
  });

  function handleInputs(val: string, name: string) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = userSchema.safeParse(formData);
    const roleResult = roleSchema.safeParse({ role });
    console.log(formData, typeof formData.fees);

    if (res.success && roleResult.success) {
      startTransition(() => {
        updateUserProfile({ role, ...formData })
          .then(() => toast.success("Successfully Completed Profile"))
          .catch((err) => toast.error(err.message || "Something went wrong"));
      });
      if (role === "doctor") {
        router.replace("/u/dashboard/scheduled_appointments");
      } else {
        router.replace("/u/dashboard/upcoming_Appointments");
      }
    } else {
      toast.error(res.error?.message);
    }
  }

  return (
    <Card className="w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Setup</CardTitle>
          <CardDescription>
            Just few Steps away From Completing Your Profile
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SelectDemo
            handleChangeRole={handleChangeRole}
            title="Role"
            items={["doctor", "patient"]}
          />

          {role === "doctor" && (
            <div className="grid gap-3">
              <div className="flex gap-2">
                <div className="w-[50%]">
                  <Label htmlFor="">Your Gender</Label>
                  <SelectDemo
                    handleChangeRole={(val) => handleInputs(val, "gender")}
                    title="Gender"
                    items={["Male", "Female"]}
                  />
                </div>

                <div className="w-[50%]">
                  <Label htmlFor="">Your Specializations</Label>
                  <SelectDemo
                    handleChangeRole={(val) =>
                      handleInputsArray(val, "specializations")
                    }
                    title="Specializations"
                    items={doctorSpecializations.toSorted()}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="Qualification">
                  Your Qualifications
                  <span className=" text-gray-400 ml-1 leading-4">
                    (Please type your qualifications by inserting commas in
                    between)
                  </span>
                </Label>
                <Textarea
                  onChange={(e) => debounced(e)}
                  name="qualification"
                  placeholder="Please Type Your Qualifications"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Tell us Something About You</Label>
                <Textarea
                  onChange={(e) => debounced(e)}
                  name="bio"
                  placeholder="Please Type Your Bio"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Awards">
                  Your Award and Certifications
                  <span className=" text-gray-400 ml-1 leading-4">
                    (Please type your Awards and Certifications by inserting commas in
                    between)
                  </span>
                </Label>
                <Textarea
                  onChange={(e) => debounced(e)}
                  name="awards"
                  placeholder="Please Type  Award and Certifications"
                />
              </div>

              <div className="flex justify-between gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="fees">Consultation Fees</Label>
                  <Input
                    name="fees"
                    id="fees"
                    type="number"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Your Experience</Label>
                  <Input
                    name="experience"
                    id="experience"
                    type="number"
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Phone No
                    <span className=" text-gray-400 ml-1">(optional)</span>
                  </Label>
                  <Input
                    name="PhoneNo"
                    id="phone"
                    type="text"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="my-4 flex flex-col gap-2">
                <Label>Your Profile Photo</Label>
                <CldUploadButton
                  className="w-full p-5 rounded-2xl bg-gray-100 flex items-center justify-center gap-2"
                  options={{ multiple: false }}
                  uploadPreset="ybwdxqf0"
                  onSuccess={(res) => {
                    if (typeof res.info === "object") {
                      const url = res.info.secure_url;

                      setFormData((prevData) => ({
                        ...prevData,
                        imageUrl: url,
                      }));
                    } else {
                      toast.error(
                        "Failed to upload image, Please try again later"
                      );
                    }
                  }}
                >
                  <UploadCloud
                    // className="absolute top-[50%] left-[30%] -translate-y-1"
                    width={30}
                    height={30}
                  />
                  <span>Upload</span>
                </CldUploadButton>
              </div>
              {formData.imageUrl && (
                // w-32 h-full
                <div className="p-2 rounded-lg w-auto h-auto">
                  <CldImage
                    width={100}
                    height={100}
                    src={formData.imageUrl}
                    alt="Description of my image"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button disabled={isPending} className="w-full" type="submit">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileSetup;

function SelectDemo({
  handleChangeRole,
  title,
  items,
}: {
  handleChangeRole: (val: string) => void;
  title: string;
  items: string[];
}) {
  return (
    <Select onValueChange={handleChangeRole} required>
      <SelectTrigger className=" capitalize">
        <SelectValue placeholder={`Choose Your ${title}`} />
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {items.map((item, ind) => (
            <SelectItem
              key={ind}
              value={item.toLowerCase()}
              className="capitalize"
            >
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

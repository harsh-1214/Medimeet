"use client";

import React, { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

interface EditFormProps {
  first_name: string;
  last_name: string;
  email: string;
  handleSubmit: (formData: FormData) => Promise<void>;
}

const EditForm = (
//   {
//   first_name,
//   last_name,
//   email,
//   handleSubmit,
// }: EditFormProps
) => {
  return (
    <Card className="w-full">
      <form
      //  onSubmit={handleSubmit}
       >
        <CardHeader>
          <CardTitle className="text-2xl">Profile Setup</CardTitle>
          <CardDescription>
            Just few Steps away From Completing Your Profile
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <SelectDemo handleChangeRole={handleChangeRole} /> */}

          {(
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="Qualification">Your Qualifications</Label>
                <Textarea
                  // onChange={(e) => debounced(e)}
                  name="qualification"
                  placeholder="Please Type Qualifications in Bullet form"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Experience">Your Experience</Label>
                <Textarea
                  // onChange={(e) => debounced(e)}
                  name="Experience"
                  placeholder="Please Type Experience in Bullet form"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Awards">Your Award and Certifications</Label>
                <Textarea
                  // onChange={(e) => debounced(e)}
                  name="Awards"
                  placeholder="Please Type  Award and Certifications in Bullet form"
                />
              </div>
              <div className="flex justify-between gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone No(optional)</Label>
                  <Input
                    name="PhoneNo"
                    id="phone"
                    type="text"
                    // onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="my-4 flex flex-col gap-2 relative">
                <Label>Your Profile Photo</Label>
                <UploadCloud
                  className="absolute top-[50%] left-[30%] -translate-y-1"
                  width={30}
                  height={30}
                />
                <CldUploadButton
                  className="w-full p-5 rounded-2xl bg-gray-100"
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
                />
              </div> */}
              {/* {formData.imageUrl && (
                // w-32 h-full
                <div className="w-36 h-28 p-2 rounded-lg">
                  <CldImage
                    width={100}
                    height={100}
                    src={formData.imageUrl}
                    alt="Description of my image"
                  />
                </div>
              )} */}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            // disabled={isPending}
            className="w-full"
            type="submit"
          >
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditForm;
// <Card>
//   <CardHeader>
//     <CardTitle>Edit Profile</CardTitle>
//   </CardHeader>
//   <CardContent>
//     <form action={handleSubmit}>

//       <div className="flex flex-col gap-6">
//         <div className='flex gap-3'>
//           <div className="w-[45%]">
//             <Label htmlFor="name">First Name</Label>
//             <Input
//               id="first_name"
//               type="text"
//               className="w-full"
//               defaultValue = {first_name}
//               />
//           </div>
//           <div className="w-[45%]">
//             <Label htmlFor="description">Last Name</Label>
//             <Input
//               id="last_name"
//               type="text"
//               className="w-full"
//               defaultValue = {last_name}
//               />
//           </div>
//         </div>
//         <div className="grid gap-3">
//           <Label htmlFor="description">Email</Label>
//           <Input
//             id="email"
//             type="text"
//             className="w-full"
//             defaultValue = {email}
//             />
//         </div>

//         <Button variant={'default'} type='submit' className='w-[50%] mx-auto'>
//               Save Changes
//         </Button>

//       </div>
//     </form>

//   </CardContent>
// </Card>

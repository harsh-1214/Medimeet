import { getDoctorProfile } from "@/actions/doctor";
import Image from "next/image";
import React from "react";
import { BookAppointment } from "../../search/_components/bookAppointmentForm";

const DoctorProfilePage = async ({
  params,
}: {
  params: {
    doctorId: string;
  };
}) => {
  try {
    const doctor = await getDoctorProfile(params.doctorId);
    return (
      <div className="bg-slate-100">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center border-b-2 border-slate-300 pb-6">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <Image
                  src={doctor.imageUrl}
                  alt="Doctor's Profile Picture"
                  className="h-48 w-48 rounded-full border-4 border-slate-400"
                  height={200}
                  width={200}
                />
              </div>
              <div className="flex-grow md:pl-8">
                <h1 className="sm:text-5xl text-3xl font-bold text-slate-800 capitalize">
                  Dr. {doctor.user.first_name}&nbsp;{doctor.user.last_name}
                </h1>
                <p className="text-xl text-slate-600 mt-2">
                  <span className="text-slate-700 font-semibold mr-1">
                    {doctor.experience}
                  </span>
                  Years of Experience
                </p>
                <p className="text-xl text-slate-600">
                  <span className="text-green-500 font-semibold mr-1">
                    &#8377;{doctor.fees}
                  </span>
                  Consultation fees
                </p>
                <div className="mt-2">
                  <BookAppointment variant={"default"} doctorId={params.doctorId} />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-semibold text-slate-700">About</h2>
              <p className="mt-3 text-slate-600">
                {doctor.bio}
              </p>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-700">
                  Qualifications
                </h2>
                <ul className="list-disc list-inside mt-3 text-slate-600 capitalize">
                  {doctor.qualification.map((qual, ind) => (
                    <li key={ind}>{qual}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-700">
                  Awards
                </h2>
                <ul className="list-disc list-inside mt-3 text-slate-600 capitalize">
                  {doctor.awards.map((award, ind) => (
                    <li key={ind}>{award}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-700">
                  Specializations
                </h2>
                <ul className="list-disc list-inside mt-3 text-slate-600 capitalize">
                  {doctor.specializations.map((spec, ind) => (
                    <li key={ind}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    console.log("Internal Server Error");
    return (
      <div className="h-full flex justify-center items-center">
        Internal Server Error, Please Try Again Later!!
      </div>
    );
  }
};

const Comp2 = () => {
  return (
    <div className="border-2 h-full mr-52 ml-52 max-w-[1400px]">
      <div className="flex gap-5 mt-32">
        <div>
          {/* <Image
            src={doctor.imageUrl}
            alt="Doctor's image"
            height={300}
            width={300}
          /> */}
        </div>
        <div className="mt-3 tracking-wide">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {/* Dr. {doctor.user.first_name}&nbsp;{doctor.user.last_name} */}
          </h2>
          <p className="text-gray-600 capitalize my-2">
            {/* {doctor.specializations.join(" , ")} */}
          </p>
          <p className="text-gray-600 my-2">
            {/* {doctor.experience} Years of Experience */}
          </p>
          <p className="text-gray-600 my-2">
            {/* &#8377; {doctor.fees} Consultation fees */}
          </p>
          <div className="mt-4 flex items-center space-x-4 my-2">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;

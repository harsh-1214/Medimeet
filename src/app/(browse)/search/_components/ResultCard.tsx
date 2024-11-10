import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookAppointment } from "./bookAppointmentForm";

interface ResultCardProps {
  first_name: string;
  last_name: string;
  imageUrl: string;
  experience: number;
  specializations: string[];
  doctorId: string;
  fees: number;
}

export const ResultCard = ({
  first_name,
  last_name,
  imageUrl,
  experience,
  specializations,
  fees,
  doctorId,
}: ResultCardProps) => {
  // It Will be in this Card

  // flex flex-col justify-center p-4 md:justify-start md:flex-row items-center space-x-6 border-2
  // md:justify-start md:flex-row flex-col justify-center
  // flex flex-col md:flex-row items-center md:items-start md:space-x-6
  // rounded-lg shadow-lg flex p-4 items-center space-x-6 border-2
  return (
    <div className="mx-auto container h-[30%]">
      <div className="rounded-lg shadow-lg p-4 flex flex-col justify-center md:flex-row items-center md:justify-start md:items-start md:space-x-6 tab:space-y-2">
        {/* Use Image component and add that image domain(url) in nextconfig */}
        <div>
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt="Doctor's portrait"
            className="w-36 h-32 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col tab:items-center w-full">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
            Dr. {first_name}&nbsp;{last_name}
          </h2>
          <p className="text-gray-600 capitalize">
            {specializations.join(" , ")}
          </p>
          <p className="text-gray-600">{experience} Years of Experience</p>
          <p className="text-gray-600">&#8377; {fees} Consultation fees</p>
          <div className="mt-4 flex tab:justify-center space-x-4 w-full">
            <Button variant={"default"} className="mobile:w-[50%]">
              <Link
                href={`/doctor/${doctorId}`}
                className="text-white px-4 py-2 rounded-m"
              >
                View Profile
              </Link>
            </Button>
            <div className="mobile:w-[50%] mobile:text-sm">
              <BookAppointment doctorId={doctorId} variant={"outline"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

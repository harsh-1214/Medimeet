// "use client";

import { getDoctors } from "@/actions/doctor";
import { ResultCard } from "./ResultCard";
import { LoaderCircleIcon } from "lucide-react";
import { PaginationComp } from "./paginationComp";
import { headers } from "next/headers";

interface doctorInfo {
  doctors: ({
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      externalUserId: string;
      role: string | null;
    };
  } & {
    id: string;
    imageUrl: string;
    qualification: string[];
    Experience: string[];
    Awards: string[];
    PhoneNo: string | null;
    userId: string;
  })[];
}

export const ResultPage = async () => {
  //   It should be Server Component // not possible

  // const [allDoctors, setAllDoctors] = useState<doctorInfo["doctors"]>();

  // Do pagination in Future

  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   getDoctors().then((res) => {
  //     setAllDoctors(res);
  //   });
  // }, []);
  const headerList = headers();
  const searchParams = headerList.get("x-current-path");
  const queryParamsArr = searchParams?.split("&");
  let queryParams: Record<string, string> = {};
  // = {
  //   fees: "",
  //   Experience: "",
  //   q: "",
  //   gender: "",
  //   page : ''
  // };
  queryParamsArr?.forEach((val) => {
    const [key, value] = val.split("=");
    // queryParams = {
    // ...queryParams,
    queryParams[key] = value;
    // };
  });
  console.log(queryParams,typeof queryParams);

  const allDoctors = await getDoctors({ queryParams });

  if (!allDoctors || allDoctors.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-center">
        {/* <LoaderCircleIcon className="animate-spin" /> */}
        No result Found!!
      </div>
    );
  }
  return (
    <>
      <div className="my-5 w-[90%]">
        {allDoctors.map((doctor) => {
          return (
            <ResultCard
              first_name={doctor.user.first_name}
              last_name={doctor.user.last_name}
              imageUrl={doctor.imageUrl}
              experience={doctor.experience}
              fees={doctor.fees}
              specializations={doctor.specializations}
              doctorId={doctor.id}
              key={doctor.id}
            />
          );
        })}
      </div>
      <PaginationComp activePage={queryParams?.page} />
    </>
  );
};

import { getAllDoctors, queryParamsInfo } from "@/lib/doctor-service";
import { ResultCard } from "./ResultCard";
import { PaginationComp } from "./paginationComp";

interface ResultPageProps {
  searchParams: queryParamsInfo;
}

export const ResultPage = async ({ searchParams }: ResultPageProps) => {
  // Fetch both the paginated doctors and the pagination metadata
  const { doctors, pagination } = await getAllDoctors(searchParams);

  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px] text-center text-gray-500">
        No doctors found matching your criteria.
      </div>
    );
  }

  return (
    <>
      <div className="my-5 w-[90%] flex flex-col gap-5 mx-auto">
        {doctors.map((doctor) => (
          <ResultCard
            key={doctor.id}
            doctorId={doctor.id}
            first_name={doctor.user.first_name}
            last_name={doctor.user.last_name}
            imageUrl={doctor.imageUrl}
            experience={doctor.experience}
            fees={doctor.fees}
            specializations={doctor.specializations}
          />
        ))}
      </div>

      {/* Only render pagination if there is more than 1 page */}
      {pagination.totalPages > 1 && (
        <PaginationComp
          activePage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  );
};
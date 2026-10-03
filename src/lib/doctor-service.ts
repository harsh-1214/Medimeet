import { db } from "./db";
import { doctorIdSchema } from "./validations";

// Update your queryParamsInfo type to accept page
export interface queryParamsInfo {
  q?: string;
  fees?: string;
  Experience?: string;
  gender?: string;
  page?: string;
}

const FEE_BOUNDS: Record<number, number> = {
  0: 500,
  500: 1000,
  1000: 2000,
};

export const getAllDoctors = async (queryParams: queryParamsInfo) => {
  try {
    // 1. Pagination Setup (4 doctors per page)
    const page = Math.max(1, Number(queryParams?.page) || 1);
    const limit = 4;
    const skip = (page - 1) * limit;

    // 2. Safely Parse Numbers (Avoids the Number("") === 0 bug)
    const feesInNum =
      queryParams?.fees &&
      queryParams.fees.trim() !== "" &&
      !isNaN(Number(queryParams.fees))
        ? Number(queryParams.fees)
        : undefined;

    const exp =
      queryParams?.Experience &&
      queryParams.Experience.trim() !== "" &&
      !isNaN(Number(queryParams.Experience))
        ? Number(queryParams.Experience)
        : undefined;

    // 3. Dynamically Build the Filter Array (Only add active filters!)
    const andConditions: any[] = [];

    // Search Query Filter (Handles single words, full names, and "+" or spaces)
    if (queryParams?.q && queryParams.q.trim() !== "") {
      const cleanQuery = queryParams.q.replace(/\+/g, " ").trim();
      const nameParts = cleanQuery.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" "); // Handles multi-word last names

      andConditions.push({
        OR: [
          {
            user: {
              first_name: { contains: firstName, mode: "insensitive" },
              ...(lastName && {
                last_name: { contains: lastName, mode: "insensitive" },
              }),
            },
          },
          // Also allow matching last_name if they only typed one word
          ...(nameParts.length === 1
            ? [
                {
                  user: {
                    last_name: { contains: firstName, mode: "insensitive" },
                  },
                },
              ]
            : []),
          {
            specializations: {
              has: cleanQuery.toLowerCase(),
            },
          },
        ],
      });
    }

    // Fees Filter
    if (feesInNum !== undefined) {
      const uppFeesBound = FEE_BOUNDS[feesInNum] ?? 100000;
      andConditions.push({
        fees: {
          gte: feesInNum,
          lte: uppFeesBound,
        },
      });
    }

    // Experience Filter
    if (exp !== undefined) {
      andConditions.push({
        experience: { gte: exp },
      });
    }

    // Gender Filter
    if (queryParams?.gender && queryParams.gender.trim() !== "") {
      andConditions.push({
        gender: {
          equals: queryParams.gender.trim(),
          mode: "insensitive",
        },
      });
    }

    // Combine conditions only if at least one filter is active
    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

    // 4. Execute Fetch and Count in Parallel for Maximum Speed
    const [doctors, totalCount] = await Promise.all([
      db.doctor.findMany({
        where: whereClause,
        include: {
          user: {
            // Optimization: Only select safe, necessary fields from User
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        orderBy: [{ experience: "desc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      db.doctor.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      doctors,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (err: any) {
    console.error("[GET_ALL_DOCTORS_ERROR]:", err);
    // Re-throw so the Server Component triggers error.tsx instead of faking "0 doctors found"
    throw new Error("Failed to load doctors list. Please try again.");
  }
};

export const getDoctorProfile = async (doctorId: string) => {
  const result = doctorIdSchema.safeParse(doctorId);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const doctor = await db.doctor.findUnique({
    where: { id: doctorId },
    include: { user: true },
  });
  if (!doctor) {
    throw new Error("Doctor not Found");
  }
  return doctor;
};

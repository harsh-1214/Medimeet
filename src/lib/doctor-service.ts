import { db } from "./db";

interface queryParamsInfo {
  fees?: string; // add field to db
  Experience?: string; // change string to type number in db
  q?: string; // done
  gender?: string; // add field to db
  page?: string; //
}

export const getAllDoctors = async (queryParams: queryParamsInfo) => {
  // Validate from Zod If you want

  try {
    const feesInNum = !isNaN(Number(queryParams?.fees))
      ? Number(queryParams?.fees)
      : undefined;
    const exp = !isNaN(Number(queryParams?.Experience))
      ? Number(queryParams?.Experience)
      : undefined;

    let uppFeesBound: number;
    if (feesInNum === 0) {
      uppFeesBound = 500;
    } else if (feesInNum === 500) {
      uppFeesBound = 1000;
    } else if (feesInNum === 1000) {
      uppFeesBound = 2000;
    } else {
      uppFeesBound = 100000;
    }

    // console.log(feesInNum);

    const nameArr = queryParams?.q?.split("+");
    console.log(nameArr?.join(' '));

    const doctors = await db.doctor.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                user: {
                  first_name: {
                    contains: nameArr ? nameArr[0] : "",
                    mode: "insensitive",
                  },
                  last_name: {
                    contains: nameArr ? nameArr[1] : "",
                    mode: "insensitive",
                  },
                },
              },
              {
                specializations: {
                  has: nameArr?.join(" ")?.toLowerCase() ?? '',
                },
              },
            ],
          },
          {
            fees: {
              gt: feesInNum,
              lte: uppFeesBound,
            },
          },
          {
            experience: {
              gte: exp,
            },
          },
          {
            gender: {
              equals: queryParams.gender,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
    return doctors;
  } catch (err: any) {
    throw new Error("Internal Server Error!");
  }
};

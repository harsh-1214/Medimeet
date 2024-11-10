import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const getSelf = async () => {

  try {
    const self = await currentUser();
    
    if (!self || !self.id) {
      throw new Error("Please Login First!");
    }
  
    const user = await db.user.findUnique({
      where: {
        externalUserId: self.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
          },
        },
        patient: {
          select: {
            id: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err : any) {
    throw new Error('Please Login First')
  }
};

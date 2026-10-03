import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const getSelf = cache(async () => {
  // 1. Synchronous JWT read (0ms network latency vs currentUser())
  const { userId } = auth();

  if (!userId) {
    throw new Error("Please Login First!");
  }

  // 2. Deduplicated Prisma query per request pass
  const user = await db.user.findUnique({
    where: { externalUserId: userId },
    include: {
      doctor: { select: { id: true } },
      patient: { select: { id: true } },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
});
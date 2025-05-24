import { prisma } from "./prisma";

export const getAllCourts = async () => {
  return await prisma.court.findMany({
    include: {
      Schedule: true,
    },
  });
};

export const getBookingHistory = async (userId: string) => {
  return await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      court: {
        include: {
          Schedule: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

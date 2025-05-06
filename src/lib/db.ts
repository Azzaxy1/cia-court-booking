import { prisma } from "./prisma";

export const getAllCourts = async () => {
  return await prisma.court.findMany({
    include: {
      prices: {
        select: {
          id: true,
          price: true,
          dayType: true,
          timeSlot: true,
        },
      },
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
          prices: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

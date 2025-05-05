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

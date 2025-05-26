import { prisma } from "./prisma";

export const getCourtWithSchedule = async () => {
  return await prisma.court.findMany({
    include: {
      Schedule: true,
    },
  });
};

export const getCourts = async () => {
  return await prisma.court.findMany();
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
      Transaction: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTotalBooking = async () => {
  return await prisma.booking.count();
};

export const getTotalRevenue = async () => {
  const result = await prisma.booking.aggregate({
    _sum: { amount: true },
    where: { status: "Paid" },
  });

  return result._sum.amount || 0;
};

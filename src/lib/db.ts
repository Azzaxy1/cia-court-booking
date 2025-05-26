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

export const getCourtStats = async () => {
  const courts = await prisma.court.findMany({
    select: { type: true },
  });

  const stats = {
    Futsal: 0,
    Badminton: 0,
    "Tenis Meja": 0,
  };

  courts.forEach((court) => {
    if (court.type === "Futsal") stats.Futsal += 1;
    else if (court.type === "Badminton") stats.Badminton += 1;
    else if (court.type === "TenisMeja") stats["Tenis Meja"] += 1;
  });

  return stats;
};

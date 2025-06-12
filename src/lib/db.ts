import { prisma } from "./prisma";

export const getCourtWithSchedule = async () => {
  return await prisma.court.findMany({
    include: {
      Schedule: true,
    },
    where: {
      isDeleted: false,
    },
  });
};

export const getCourts = async () => {
  return await prisma.court.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isDeleted: false,
    },
  });
};

export const getBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      booking: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllSchedules = async () => {
  return await prisma.schedule.findMany({
    include: {
      court: true,
    },
    orderBy: {
      date: "asc",
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
      Transaction: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTotalBookingCurrentMonth = async () => {
  const currentMonth = new Date().getMonth();
  const result = await prisma.booking.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), currentMonth, 1),
        lt: new Date(new Date().getFullYear(), currentMonth + 1, 1),
      },
    },
  });
  return result;
};

export const getTotalRevenueCurrentMonth = async () => {
  const currentMonth = new Date().getMonth();
  const result = await prisma.booking.aggregate({
    _sum: { amount: true },
    where: {
      status: "Paid",
      date: {
        gte: new Date(new Date().getFullYear(), currentMonth, 1),
        lt: new Date(new Date().getFullYear(), currentMonth + 1, 1),
      },
    },
  });

  return result._sum.amount || 0;
};

export const getCourtStats = async () => {
  const courts = await prisma.court.findMany({
    where: { isDeleted: false },
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

export const getOrderStats = async () => {
  const bookings = await prisma.booking.findMany({
    where: {
      status: "Paid",
    },
    select: {
      date: true,
      courtType: true,
    },
  });

  return bookings.map((booking) => ({
    date: booking.date.toISOString(),
    fieldType: booking.courtType,
  }));
};

export const getRevenueStats = async () => {
  // Ambil semua booking Paid
  const bookings = await prisma.booking.findMany({
    where: { status: "Paid" },
    select: {
      date: true,
      courtType: true,
      amount: true,
    },
  });

  return bookings.map((booking) => ({
    date: booking.date.toISOString(),
    amount: booking.amount,
    courtType: booking.courtType,
  }));
};

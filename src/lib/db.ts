import { Prisma, BookingStatus } from "@/app/generated/prisma";
import { prisma } from "./prisma";

interface GetBookingsFilters {
  userId?: string;
  status?: string;
  courtId?: string;
  date?: string;
  search?: string;
}

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
    include: {
      Schedule: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isDeleted: false,
    },
  });
};
export const getBookings = async (filters?: GetBookingsFilters) => {
  const where: Prisma.BookingWhereInput = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.status && filters.status !== "all") {
    where.status = filters.status as BookingStatus;
  }
  if (filters?.courtId && filters.courtId !== "all") {
    where.courtId = filters.courtId;
  }
  if (filters?.date) where.date = filters.date;
  if (filters?.search) {
    where.OR = [
      {
        user: {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        court: {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        paymentMethod: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return await prisma.booking.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      court: true,
      Schedule: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTransactionsWithDetails = async () => {
  return await prisma.transaction.findMany({
    where: {
      status: { in: ["settlement", "capture", "paid"] },
    },
    include: {
      booking: {
        include: {
          court: true,
          user: true,
        },
      },
      recurringBooking: {
        include: {
          court: true,
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCourtsForFilter = async () => {
  return await prisma.court.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      type: true,
    },
    orderBy: { name: "asc" },
  });
};
export const getAllSchedules = async () => {
  return await prisma.schedule.findMany({
    include: {
      court: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    where: {
      court: {
        isDeleted: false,
      },
    },
  });
};

export const getScheduleStats = async () => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const [total, available, todaySchedules, weekSchedules] = await Promise.all([
    prisma.schedule.count(),
    prisma.schedule.count({ where: { available: true } }),
    prisma.schedule.count({
      where: {
        date: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    }),
    prisma.schedule.count({
      where: {
        date: {
          gte: startOfToday,
          lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    total,
    available,
    occupied: total - available,
    todaySchedules,
    weekSchedules,
  };
};

export const getBookingHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
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
      skip,
      take: limit,
    }),
    prisma.booking.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  const bookingsWithCorrectPaymentMethod = bookings.map((booking) => {
    const latestTransaction =
      booking.Transaction && booking.Transaction.length > 0
        ? booking.Transaction[booking.Transaction.length - 1]
        : null;

    return {
      ...booking,
      date: booking.date?.toISOString() || null, // ✅ ENSURE DATE IS STRING
      paymentMethod:
        latestTransaction?.paymentMethod || booking.paymentMethod || "Cash",
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    bookings: bookingsWithCorrectPaymentMethod,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getTotalBookingCurrentMonth = async () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Count regular bookings
  const regularBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfCurrentMonth,
        lt: endOfCurrentMonth,
      },
    },
  });

  // Count recurring bookings
  const recurringBookings = await prisma.recurringBooking.count({
    where: {
      createdAt: {
        gte: startOfCurrentMonth,
        lt: endOfCurrentMonth,
      },
    },
  });

  return regularBookings + recurringBookings;
};

export const getTotalRevenueCurrentMonth = async () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      status: { in: ["settlement", "capture", "paid"] },
      createdAt: {
        gte: startOfCurrentMonth,
        lt: endOfCurrentMonth,
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
  const transactions = await prisma.transaction.findMany({
    where: {
      status: { in: ["settlement", "capture", "paid"] },
    },
    include: {
      booking: {
        select: {
          date: true,
          courtType: true,
        },
      },
      recurringBooking: {
        select: {
          startDate: true,
          courtType: true,
        },
      },
    },
  });

  // Gabungkan transaksi booking biasa dan recurring
  return transactions.flatMap((transaction) => {
    if (transaction.booking) {
      return [
        {
          date: transaction.booking.date.toISOString(),
          fieldType: transaction.booking.courtType,
        },
      ];
    }
    if (transaction.recurringBooking) {
      return [
        {
          date: transaction.recurringBooking.startDate.toISOString(),
          fieldType: transaction.recurringBooking.courtType,
        },
      ];
    }
    return [];
  });
};

export const getRevenueStats = async () => {
  // Ambil semua transaksi yang sudah paid
  const transactions = await prisma.transaction.findMany({
    where: {
      status: { in: ["settlement", "capture", "paid"] },
    },
    include: {
      booking: {
        select: {
          date: true,
          courtType: true,
        },
      },
      recurringBooking: {
        select: {
          startDate: true,
          courtType: true,
        },
      },
    },
  });

  // Gabungkan transaksi booking biasa dan recurring
  return transactions.flatMap((transaction) => {
    if (transaction.booking) {
      return [
        {
          date: transaction.booking.date.toISOString(),
          amount: transaction.amount,
          courtType: transaction.booking.courtType,
        },
      ];
    }
    if (transaction.recurringBooking) {
      // Untuk recurring, gunakan startDate (atau bisa juga breakdown per sesi jika ada detail sesi)
      return [
        {
          date: transaction.recurringBooking.startDate.toISOString(),
          amount: transaction.amount,
          courtType: transaction.recurringBooking.courtType,
        },
      ];
    }
    return [];
  });
};

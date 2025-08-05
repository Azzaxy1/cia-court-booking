import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRupiah = (price: number) => {
  return `Rp. ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

export const formattedDate = (date: Date | string | null | undefined) => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return format(dateObj, "d MMMM yyyy", { locale: id });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

export const formattedTime = (date: Date | string | null | undefined) => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return format(dateObj, "HH:mm", { locale: id });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
};

export const toUTCDateOnly = (dateInput: string | Date) => {
  let year: number, month: number, day: number;

  if (typeof dateInput === "string") {
    // Parse string secara manual untuk menghindari timezone issues
    [year, month, day] = dateInput.split("-").map(Number);
  } else {
    const d = new Date(dateInput);
    year = d.getFullYear();
    month = d.getMonth() + 1; // Konversi ke 1-based month
    day = d.getDate();
  }

  // Buat UTC date dengan waktu 12:00:00 (siang hari) untuk menghindari timezone shift
  // Menggunakan ISO string format untuk memastikan konsistensi
  const isoString = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}T12:00:00.000Z`;
  const result = new Date(isoString);

  return result;
};

// Fungsi helper untuk format tanggal yang konsisten
export const formatDateString = (date: Date): string => {
  // Gunakan UTC methods untuk menghindari timezone issues
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fungsi helper untuk parse tanggal string yang konsisten
export const parseDateString = (dateString: string): Date => {
  // Gunakan toUTCDateOnly untuk konsistensi
  return toUTCDateOnly(dateString);
};

export const calculateEndTime = (startTime: string, duration: number = 1) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHour = hours + duration;
  return `${endHour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Format nama sport
export const formatSportType = (type: string) => {
  switch (type) {
    case "futsal":
      return "Futsal";
    case "badminton":
      return "Badminton";
    case "tableTennis":
      return "Tenis Meja";
    default:
      return type;
  }
};

interface Order {
  date: string;
  fieldType: string;
}

export interface MonthlyData {
  month: string;
  futsal: number;
  badminton: number;
  tenisMeja: number;
  [key: string]: string | number;
}

export const generateChartOrder = (ordersData: Order[]): MonthlyData[] => {
  const monthlyData: { [key: string]: MonthlyData } = {};

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const lastSixMonths = () => {
    const startMonth = currentMonth < 6 ? 0 : currentMonth - 5;

    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (startMonth + i) % 12;
      const year = currentYear - Math.floor((startMonth + i) / 12);
      return {
        month: new Date(year, monthIndex, 1).toLocaleString("en-US", {
          month: "long",
        }),
        year,
      };
    });
  };

  ordersData.forEach((order) => {
    const orderDate = new Date(order.date);
    const month = orderDate.toLocaleString("en-US", { month: "long" });
    const year = orderDate.getFullYear();

    if (
      !lastSixMonths().some(
        (entry) => entry.month === month && entry.year === year
      )
    )
      return;

    const fieldMap: { [key: string]: keyof MonthlyData } = {
      Futsal: "futsal",
      futsal: "futsal",
      Badminton: "badminton",
      badminton: "badminton",
      TenisMeja: "tenisMeja",
      "Tenis Meja": "tenisMeja",
      "tenis meja": "tenisMeja",
      tenismeja: "tenisMeja",
    };

    const fieldType = fieldMap[order.fieldType] || "";

    if (!fieldType) {
      console.warn("Unmapped field type:", order.fieldType);
      return;
    }

    const key = `${month} ${year}`;

    if (!monthlyData[key]) {
      monthlyData[key] = {
        month: `${month} ${year}`,
        futsal: 0,
        badminton: 0,
        tenisMeja: 0,
      };
    }

    monthlyData[key][fieldType] = (monthlyData[key][fieldType] as number) + 1;
  });

  const result = lastSixMonths().map(
    ({ month, year }) =>
      monthlyData[`${month} ${year}`] || {
        month: `${month} ${year}`,
        futsal: 0,
        badminton: 0,
        tenisMeja: 0,
      }
  );

  return result;
};

interface Revenue {
  date: string;
  amount: number;
  courtType: string;
}

export const generateChartRevenue = (revenueData: Revenue[]): MonthlyData[] => {
  // Kelompokkan dan jumlahkan per bulan dan jenis lapangan
  const monthlyRevenue: { [key: string]: { [key: string]: number } } = {};

  revenueData.forEach((b) => {
    const date = new Date(b.date);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    const type =
      b.courtType === "Futsal"
        ? "futsal"
        : b.courtType === "Badminton"
        ? "badminton"
        : "tenisMeja";

    if (!monthlyRevenue[key]) {
      monthlyRevenue[key] = { futsal: 0, badminton: 0, tenisMeja: 0 };
    }
    monthlyRevenue[key][type] += b.amount;
  });

  // Ambil 6 bulan terakhir
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const lastSixMonths = () => {
    const startMonth = currentMonth < 6 ? 0 : currentMonth - 5;
    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (startMonth + i) % 12;
      const year = currentYear - Math.floor((startMonth + i) / 12);
      return {
        month: new Date(year, monthIndex, 1).toLocaleString("en-US", {
          month: "long",
        }),
        year,
      };
    });
  };

  // Format data untuk chart
  return lastSixMonths().map(({ month, year }) => {
    const key = `${month} ${year}`;
    return {
      month: key,
      futsal: monthlyRevenue[key]?.futsal || 0,
      badminton: monthlyRevenue[key]?.badminton || 0,
      tenisMeja: monthlyRevenue[key]?.tenisMeja || 0,
    };
  });
};

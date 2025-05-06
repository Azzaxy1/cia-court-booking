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

export const formattedDate = (date: Date) => {
  return format(date, "d MMMM yyyy", { locale: id });
};

export const formattedTime = (date: Date) => {
  return format(date, "HH:mm", { locale: id });
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

interface MonthlyData {
  month: string;
  futsal: number;
  badminton: number;
  tenisMeja: number;
  [key: string]: string | number;
}
export const generateChartData = (ordersData: Order[]): MonthlyData[] => {
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
      futsal: "futsal",
      badminton: "badminton",
      "tenis meja": "tenisMeja",
    };

    const fieldType = fieldMap[order.fieldType.toLowerCase()] || "";

    if (!fieldType) return;

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

  return lastSixMonths().map(
    ({ month, year }) =>
      monthlyData[`${month} ${year}`] || {
        month: `${month} ${year}`,
        futsal: 0,
        badminton: 0,
        tenisMeja: 0,
      }
  );
};


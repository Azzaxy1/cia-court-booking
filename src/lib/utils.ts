import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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


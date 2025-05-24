import { StaticImageData } from "next/image";
import { Schedule } from "@/app/generated/prisma";

export type CourtType = "Futsal" | "Badminton" | "TenisMeja";
type FutsalSurface = "Interlok" | "Rumput" | "Semen";

export type TimeSlot = "Pagi" | "Siang" | "Malam";
export type DayType = "Weekday" | "Weekend";

export interface Court {
  id: number;
  name: string;
  type?: string;
  image: string;
  price: string;
}

export interface CourtReal {
  id: string;
  name: string;
  type: CourtType;
  surfaceType?: FutsalSurface | null;
  image: string | StaticImageData;
  Schedule?: Schedule[];
  description: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

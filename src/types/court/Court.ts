import { StaticImageData } from "next/image";

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
  prices?:
    | {
        id: string;
        dayType: DayType;
        timeSlot: TimeSlot;
        price: number;
      }[];
  description: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

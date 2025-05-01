type CourtType = "Futsal" | "Badminton" | "Tenis Meja";
type FutsalSurface = "Interlok" | "Rumput" | "Semen";

export type TimeSlot = "Pagi" | "Siang" | "Malam";
export type DayType = "Weekday" | "Weekend";

export interface Court {
  id: number;
  name: string;
  type?: string;
  image: string;
  price: string;
  available: boolean;
}

export interface CourtReal {
  id: number;
  name: string;
  type: CourtType;
  surfaceType?: FutsalSurface;
  image: string;
  price: {
    [day in DayType]: {
      [time in TimeSlot]: number;
    };
  };
  available: boolean;
  description: string;
}

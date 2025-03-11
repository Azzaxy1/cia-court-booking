import { images } from "@/assets";
import { IBookingHistory } from "@/types/BookingHistory";

// Data dummy untuk histori pemesanan
export const bookingHistory: IBookingHistory[] = [
  {
    id: "BK-24578",
    courtName: "Lapangan Futsal 2",
    courtType: "futsal",
    date: "5 Maret 2025",
    time: "18:00 - 20:00",
    status: "completed",
    price: "Rp. 200.000",
    image: images.Futsal,
  },
  {
    id: "BK-24123",
    courtName: "Lapangan Badminton 1",
    courtType: "badminton",
    date: "28 Februari 2025",
    time: "19:00 - 21:00",
    status: "completed",
    price: "Rp. 150.000",
    image: images.Badminton,
  },
  {
    id: "BK-24892",
    courtName: "Lapangan Tenis Meja 1",
    courtType: "tableTennis",
    date: "10 Maret 2025",
    time: "16:00 - 18:00",
    status: "upcoming",
    price: "Rp. 100.000",
    image: images.TenisMeja,
  },
];

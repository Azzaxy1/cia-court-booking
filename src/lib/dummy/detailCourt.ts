import { Users } from "lucide-react";

const schedule = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const courtInfo = {
  futsal: {
    title: "Lapangan Futsal",
    icon: Users,
    features: [
      "Lantai Interlock & Rumput Sintetis",
      "Pencahayaan Standar Malam Hari",
      "Area Tunggu Penonton",
      "Kamar Ganti & Toilet",
      "Penyewaan Bola & Rompi",
    ],
    openHours: "07:00 - 23:00 WIB",
  },
  badminton: {
    title: "Lapangan Badminton",
    icon: Users,
    features: [
      "Lantai Karpet Vinyl Standar",
      "Pencahayaan Anti-Silau",
      "Area Istirahat Pemain",
      "Kamar Ganti & Toilet",
      "Penyewaan Shuttlecock & Raket",
    ],
    openHours: "07:00 - 23:00 WIB",
  },
  tableTennis: {
    title: "Lapangan Tenis Meja",
    icon: Users,
    features: [
      "Meja Standar Turnamen",
      "Pencahayaan Fokus Optimal",
      "Lantai Anti-Slip (Non-licin)",
      "Area Bermain yang Luas",
      "Penyewaan Bet & Bola",
      "Kipas Angin Dinding",
    ],
    openHours: "07:00 - 23:00 WIB",
  },
};

// Ulasan dummy
const reviews = [
  {
    name: "Budi Santoso",
    rating: 5,
    comment:
      "Lapangan sangat terawat dan fasilitas lengkap. Pasti akan kembali lagi.",
    date: "15 Feb 2025",
  },
  {
    name: "Dewi Pratiwi",
    rating: 4,
    comment:
      "Pelayanan ramah dan booking sangat mudah. Hanya saja parkir agak terbatas.",
    date: "3 Feb 2025",
  },
  {
    name: "Andi Wijaya",
    rating: 5,
    comment:
      "Saya rutin bermain di sini setiap minggu. Tempatnya bersih dan nyaman.",
    date: "28 Jan 2025",
  },
];

export { courtInfo, reviews, schedule };

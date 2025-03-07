import { PiCourtBasketball } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

export const howToOrder = [
  {
    id: 1,
    title: "Pilih Lapangan",
    description: "Temukan jenis lapangan sesuai kebutuhan Anda.",
    icon: PiCourtBasketball,
  },
  {
    id: 2,
    title: "Tentukan Jadwal",
    description: "Pilih jadwal bermain yang sesuai dengan waktu luang Anda.",
    icon: SlCalender,
  },
  {
    id: 3,
    title: "Lakukan Pembayaran",
    description: "Lakukan pembayaran dengan metode yang aman dan terpercaya.",
    icon: MdOutlinePayments,
  },
] as const;

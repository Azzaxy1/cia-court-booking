import { MdHome } from "react-icons/md";
import { PiCourtBasketballFill } from "react-icons/pi";
import { AiFillSchedule } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { CalendarClock } from "lucide-react";

export const navUser = [
  {
    id: 1,
    title: "Beranda",
    link: "/",
    icon: MdHome,
  },
  {
    id: 2,
    title: "Daftar Lapangan",
    link: "/lapangan",
    icon: PiCourtBasketballFill,
  },
  {
    id: 3,
    title: "Tentang Kami",
    link: "/tentang-kami",
    icon: FaBuilding,
  },
] as const;

export const navAdmin = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: MdHome,
  },
  {
    title: "Lapangan",
    url: "/admin/lapangan",
    icon: PiCourtBasketballFill,
  },
  {
    title: "Jadwal",
    url: "/admin/jadwal",
    icon: AiFillSchedule,
  },
  {
    title: "Semua Pemesanan",
    url: "/admin/pemesanan",
    icon: IoCart,
  },
  {
    title: "Pemesanan Berulang",
    url: "/admin/pemesanan-berulang",
    icon: CalendarClock,
  },
  {
    title: "Pemasukan",
    url: "/admin/pemasukan",
    icon: FaMoneyBillWave,
  },
  {
    title: "Keluar",
    onClick: () => {
      signOut({
        callbackUrl: "/admin/login",
      });
      toast.success("Berhasil keluar dari akun");
    },
    icon: IoLogOut,
  },
];

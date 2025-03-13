import { MdHome } from "react-icons/md";
import {
  PiCourtBasketballDuotone,
  PiCourtBasketballFill,
} from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

export const navUser = [
  {
    id: 1,
    title: "Beranda",
    link: "/",
    icon: MdHome,
  },
  {
    id: 2,
    title: "Booking Lapangan",
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
    icon: PiCourtBasketballDuotone,
  },
  {
    title: "Pemesanan",
    url: "/admin/pemesanan",
    icon: IoCart,
  },
  {
    title: "Pemasukan",
    url: "/admin/pemasukan",
    icon: FaMoneyBillWave,
  },
  {
    title: "Keluar",
    url: "/admin/login",
    icon: BiLogOut,
  },
];

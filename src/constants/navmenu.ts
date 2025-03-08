import { MdHome } from "react-icons/md";
import { PiCourtBasketballFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";

export const navMenu = [
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

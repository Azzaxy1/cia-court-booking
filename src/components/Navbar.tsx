import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { image } from "@/assets";
import { IoCloseSharp } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { PiCourtBasketballFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navmenu = [
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
      link: "/tentang",
      icon: FaBuilding,
    },
  ];

  return (
    <header className="w-full fixed bg-white shadow-md py-3 px-4 md:px-6">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={image.Logo}
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <IoCloseSharp className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden  md:flex items-center space-x-6">
            {navmenu.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="flex justify-center items-center text-gray-700 hover:text-primary"
              >
                <span className="mr-2">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>{item.title}</span>
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-primary text-gray-700"
              >
                Masuk
              </Button>
              <Button className="bg-primary hover:bg-primary-foreground text-white">
                Buat Akun
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-4">
              {navmenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="flex items-center text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>{item.title}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700"
                >
                  Masuk
                </Button>
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                  Buat Akun
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

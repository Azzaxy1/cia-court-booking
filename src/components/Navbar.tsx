import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { images } from "@/assets";
import { IoCloseSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { navMenu } from "@/constants/navmenu";
import AccountMenu from "./AccountMenu";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLogin = true;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full z-50 fixed bg-white shadow-md py-3 md:px-6">
      <div data-aos="fade-down" className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={images.LogoDark}
              alt="Logo"
              className="w-[48px] h-[48px] object-contain"
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-all duration-300"
            >
              {isMenuOpen ? (
                <IoCloseSharp className="h-6 w-6 transform rotate-180 transition-transform duration-300" />
              ) : (
                <FiMenu className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden  md:flex items-center space-x-6">
            {navMenu.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className={`flex justify-center hover:underline hover:underline-offset-4 items-center text-gray-700 hover:text-primary ${
                  pathname === item.link && "text-primary font-semibold "
                }`}
              >
                <span className="mr-2">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>{item.title}</span>
              </Link>
            ))}
            {isLogin ? (
              <AccountMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-primary text-gray-700"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary-foreground text-white">
                    Buat Akun
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transform transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col space-y-4">
            {navMenu.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className={`flex items-center text-gray-700 hover:text-primary ${
                  pathname === item.link && "text-primary font-semibold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>{item.title}</span>
              </Link>
            ))}
            {isLogin ? (
              <AccountMenu />
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary-foreground text-white">
                    Buat Akun
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

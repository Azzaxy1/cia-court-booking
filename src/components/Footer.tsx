import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { images } from "@/assets";
import { navMenu } from "@/constants/navmenu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary container text-white">
      <div className="container mx-auto px-4 pt-12 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <Image
                src={images.LogoLight}
                alt="CIA Serang Logo"
                width={70}
                height={70}
                className="object-contain"
              />
              <h2 className="text-2xl font-bold text-white">CIA Serang</h2>
            </div>
            <div className="md:pl-4">
              <p className="text-gray-300">
                Penyedia lapangan olahraga premium dengan fasilitas terbaik
                untuk berbagai jenis olahraga di Kota Serang.
              </p>
              <div className="flex space-x-4 mt-4">
                <Link
                  href="https://facebook.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-white pb-2 text-white">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              {navMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-white pb-2 text-white">
              Jenis Lapangan
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-300 flex items-center">
                <span className="mr-2">›</span> Lapangan Futsal
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-2">›</span> Lapangan Badminton
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-2">›</span> Lapangan Tenis Meja
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-white pb-2 text-white">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-white flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Jl. Cilampang, Unyur, Kec. Serang, Kota Serang, Banten 42111
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300">+62 851-8219-8144</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300">info@ciaserang.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mr-3 h-5 w-5 text-white flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">Setiap Hari: 07.00 - 23.00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary py-4">
        <div className="mx-auto px-4">
          <div className="flex flex-col border-t pt-4 border-white md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              © {currentYear} CIA Serang. Hak Cipta Dilindungi.
            </p>
            <div className="mt-3 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

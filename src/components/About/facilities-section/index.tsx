import { images } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Facilities = () => {
  return (
    <section className="py-16 md:px-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fasilitas Unggulan
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            CIA Serang dilengkapi dengan fasilitas modern untuk menjamin
            kenyamanan dan kepuasan pelanggan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-56 relative">
              <Image
                src={images.About2}
                alt="Lapangan Futsal"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lapangan Futsal
              </h3>
              <p className="text-gray-600 mb-4">
                6 lapangan futsal indoor dengan berbagai jenis tipe lapangan dan
                pencahayaan profesional untuk permainan yang optimal.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-56 relative">
              <Image
                src={images.About4}
                alt="Lapangan Badminton"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lapangan Badminton
              </h3>
              <p className="text-gray-600 mb-4">
                7 lapangan badminton dengan lantai vinyl berkualitas tinggi dan
                pencahayaan anti-silau untuk kenyamanan bermain.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-56 relative">
              <Image
                src={images.About3}
                alt="Lapangan Basket"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lapangan Tenis Meja
              </h3>
              <p className="text-gray-600 mb-4">
                2 Lapangan tenis meja indoor dengan lantai kayu berstandar
                internasional dan pencahayaan profesional untuk permainan yang
                optimal.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/lapangan"
            className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            Lihat Semua Lapangan
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Facilities;

import { images } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-primary rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Siap untuk Bergabung?
              </h2>
              <p className="text-gray-300 mb-6">
                Jangan lewatkan kesempatan untuk menggunakan fasilitas olahraga
                terbaik di Kota Serang. Jadwalkan kunjungan anda hari ini!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/lapangan"
                  className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Sewa Lapangan
                </Link>
                <Link
                  href="https://wa.me/6285182198144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-lg overflow-hidden">
              <Image
                src={images.About1}
                alt="Booking Lapangan"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

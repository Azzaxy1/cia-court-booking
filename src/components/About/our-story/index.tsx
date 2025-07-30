import { images } from "@/assets";
import Image from "next/image";
import React from "react";

const OurStory = () => {
  return (
    <section className="py-16 md:px-12">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Cerita Kami
            </h2>
            <div className="space-y-4 text-gray-700 text-justify">
              <p>
                CIA Serang didirikan pada tahun 2018 oleh sekelompok penggemar
                olahraga yang percaya bahwa masyarakat Serang layak mendapatkan
                fasilitas olahraga berkualitas tinggi.
              </p>
              <p>
                Berawal dari lapangan futsal sederhana, kini CIA Serang telah
                berkembang menjadi pusat olahraga terlengkap di Kota Serang
                dengan berbagai jenis lapangan termasuk futsal, badminton, tenis
                meja. Semua lapangan kami dirancang untuk memberikan pengalaman
                bermain terbaik bagi semua level pemain.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src={images.CourtBadminton}
              alt="CIA Serang Founding Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

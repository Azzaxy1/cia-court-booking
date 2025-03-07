import { images } from "@/assets";
import Image from "next/image";
import React from "react";

const HeroAbout = () => {
  return (
    <section className="relative">
      <div className="w-full h-96 relative">
        <Image
          src={images.Cia}
          alt="CIA Serang Sports Facility"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            Tempat di mana semangat olahraga dan komunitas bertemu di Kota
            Serang
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroAbout;

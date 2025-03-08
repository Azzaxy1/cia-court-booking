import { images } from "@/assets";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center  md:px-12 pt-20 md:pt-0 pb-10 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full container">
        <div
          className="flex flex-col justify-center  md:text-left"
          data-aos="fade-right"
        >
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800">
            Nikmati Pengalaman Bermain di{" "}
            <span className="text-primary">Lapangan Terbaik!</span>
          </h1>
          <p className="text-sm sm:text-base 2xl:text-lg mt-4 text-justify text-slate-600">
            Temukan dan sewa lapangan futsal, badminton, dan tenis meja yang
            sesuai dengan kebutuhan Anda. Kami menyediakan fasilitas terbaik
            untuk mendukung hobi dan aktivitas olahraga Anda, mulai dari
            pemesanan mudah hingga pembayaran yang aman.
          </p>
          <div className="mt-6">
            <Link href="/lapangan">
              <Button
                className="text-white px-6 py-3 text-sm sm:text-base"
                data-aos="zoom-in"
              >
                Sewa Lapangan Sekarang
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="flex md:justify-end justify-center items-end"
          data-aos="fade-left"
        >
          <Image
            src={images.Hero}
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg 2xl:max-w-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

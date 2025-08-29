import { images } from "@/assets";
import Image from "next/image";
import React from "react";
import { featuresCourt } from "@/constants/featuresCourt";

const AboutSection = () => {
  return (
    <section className="flex items-center bg-[#F2FDFC] justify-center md:px-12 pt-20 md:pt-0 pb-10 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 w-full container">
        <div className="flex justify-start items-start" data-aos="fade-left">
          <Image
            src={images.About}
            alt="About Image"
            width={500}
            height={500}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PC9zdmc+"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg 2xl:max-w-2xl"
            quality={85}
          />
        </div>
        <div
          className="flex flex-col justify-center md:text-left"
          data-aos="fade-right"
        >
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800">
            Lapangan Olahraga{" "}
            <span className="text-primary">Pilihan Terbaik</span>
          </h1>
          <p className="text-sm sm:text-base 2xl:text-lg mt-4 text-justify text-slate-600">
            Kami menyediakan lapangan olahraga berkualitas untuk futsal,
            badminton, dan tenis meja, lengkap dengan fasilitas terbaik yang
            mendukung pengalaman bermain Anda. Pesan lapangan dengan mudah
            melalui sistem online yang cepat dan terpercaya.
          </p>
          {featuresCourt.map((feature) => (
            <div key={feature.id} className="flex items-center mt-4">
              <span className="text-primary text-xl mr-2">
                <feature.icon />
              </span>
              <p className="text-sm sm:text-base 2xl:text-lg text-slate-600 text-justify">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
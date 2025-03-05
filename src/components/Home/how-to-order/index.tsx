import { images } from "@/assets";
import Image from "next/image";
import React from "react";
import { HOWTOORDER } from "@/constants/howToOrder";

const HowToOrder = () => {
  return (
    <section className="flex items-center justify-center px-6 md:px-12 pt-10 md:pt-6 pb-10 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <div
          className="flex flex-col justify-center  md:text-left"
          data-aos="fade-right"
        >
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-semibold leading-tight text-slate-800">
            Pesan Lapangan Anda dalam{" "}
            <span className="text-primary">3 Langkah Mudah!</span>
          </h1>
          <p className="text-sm sm:text-base mt-4 text-justify text-slate-600">
            Kami mempermudah Anda untuk memesan lapangan dengan proses cepat dan
            tanpa ribet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {HOWTOORDER.map((order) => (
              <div key={order.id} className="flex flex-col">
                <section className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary px-2 py-1">
                    <span className="text-white">{order.id}</span>
                  </div>
                  <order.icon className="text-primary w-[40px] h-[40px]" />
                  <h4 className="text-sm sm:text-base text-primary font-semibold">
                    {order.title}
                  </h4>
                </section>
                <div className="text-sm sm:text-basetext-slate-600">
                  <p>{order.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center" data-aos="fade-left">
          <Image
            src={images.HowToOrder}
            alt="Tenis Image"
            width={300}
            height={300}
            className="w-full max-w-sm sm:max-w-md md:max-w-md 2xl:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;

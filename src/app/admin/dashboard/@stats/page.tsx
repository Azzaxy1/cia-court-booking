import { FaCartShopping } from "react-icons/fa6";
import React from "react";
import { PiCourtBasketballFill } from "react-icons/pi";
import { court } from "@/lib/dummy/court";

const Stats = () => {
  const totalCourts =
    court.futsal.length + court.badminton.length + court.tableTennis.length;

  return (
    <section className="flex gap-4 mb-4">
      <div className="p-4 flex gap-4 items-center bg-green-500 text-white rounded-lg w-1/2">
        <PiCourtBasketballFill className="w-[40px] h-[40px]" />
        <div>
          <p className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">
            {totalCourts}
          </p>
          <p>Jumlah Lapangan</p>
        </div>
      </div>
      <div className="p-4 flex gap-4 items-center bg-[#489CFF] text-white rounded-lg w-1/2">
        <FaCartShopping className="w-[40px] h-[40px]" />
        <div>
          <p className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">450</p>
          <p>Total Pemesanan</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;

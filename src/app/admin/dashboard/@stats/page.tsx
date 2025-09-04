import { FaCartShopping } from "react-icons/fa6";
import React from "react";
import { PiCourtBasketballFill } from "react-icons/pi";
import {
  getTotalBookingCurrentMonth,
  getTotalRevenueCurrentMonth,
  getCourts,
} from "@/lib/db";
import { FaMoneyBill } from "react-icons/fa";
import { formatRupiah } from "@/lib/utils";

export const dynamic = 'force-dynamic';

const Stats = async () => {
  const totalBooking = await getTotalBookingCurrentMonth();
  const totalRevenue = await getTotalRevenueCurrentMonth();

  const totalCourts = await getCourts();

  return (
    <section className="flex gap-4 mb-4">
      <div className="p-4 flex gap-4 items-center bg-[#489CFF] text-white rounded-lg w-1/2">
        <PiCourtBasketballFill className="w-[40px] h-[40px]" />
        <div>
          <p className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">
            {totalCourts.length}
          </p>
          <p>Jumlah Lapangan</p>
        </div>
      </div>
      <div className="p-4 flex gap-4 items-center bg-green-500 text-white rounded-lg w-1/2">
        <FaCartShopping className="w-[40px] h-[40px]" />
        <div>
          <p className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">
            {totalBooking}
          </p>
          <p>Total Pemesanan</p>
        </div>
      </div>
      <div className="p-4 flex gap-4 items-center bg-red-500 text-white rounded-lg w-1/2">
        <FaMoneyBill className="w-[40px] h-[40px]" />
        <div>
          <p className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">
            {formatRupiah(totalRevenue)}
          </p>
          <p>Total Pemasukan</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;

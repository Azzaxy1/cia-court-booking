import React from "react";
// import { court } from "@/lib/dummy/court";
import SelectCourt from "@/components/Lapangan/select-court";
import { getAllCourts } from "@/lib/db";

const CourtPage = async () => {
  const courts = await getAllCourts();

  return (
    <div className="container mx-auto md:px-12 pt-24 pb-10">
      <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800 mb-8 text-center">
        Cari Lapangan <span className="text-primary">Kesukaan Anda</span>
      </h1>

      <SelectCourt courts={courts} />
    </div>
  );
};

export default CourtPage;

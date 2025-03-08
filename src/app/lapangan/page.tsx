"use client";
import React from "react";
import { facilities } from "@/lib/facilities";
import SelectCourt from "@/components/Lapangan/select-court";

export default function FacilitiesPage() {
  // const [activeTab, setActiveTab] = useState("futsal");

  return (
    <div className="container mx-auto md:px-12 py-20">
      <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800 mb-8 text-center">
        Cari Lapangan <span className="text-primary">Kesukaan Anda</span>
      </h1>

      <SelectCourt facilities={facilities} />
    </div>
  );
}

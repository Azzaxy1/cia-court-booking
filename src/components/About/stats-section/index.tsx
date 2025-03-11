import React from "react";

const StatsSection = () => {
  return (
    <section className="py-16 px-4 bg-teal-700 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">5+</div>
            <p className="text-teal-100">Tahun Pengalaman</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">15</div>
            <p className="text-teal-100">Lapangan Olahraga</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">50k+</div>
            <p className="text-teal-100">Pelanggan Puas</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

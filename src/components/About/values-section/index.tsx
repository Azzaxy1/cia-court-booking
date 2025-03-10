import { Award, Star, Users } from "lucide-react";
import React from "react";

const ValuesSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nilai-Nilai Kami
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Sebagai pusat olahraga terkemuka di Serang, kami beroperasi
            berdasarkan nilai-nilai yang membentuk setiap aspek layanan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Kualitas Premium
            </h3>
            <p className="text-gray-600">
              Kami berkomitmen untuk menyediakan fasilitas dan pelayanan
              berkualitas tinggi yang memenuhi standar internasional untuk
              memastikan pengalaman olahraga terbaik.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Inklusivitas
            </h3>
            <p className="text-gray-600">
              Kami menyambut semua orang dari berbagai latar belakang, usia, dan
              tingkat kemampuan untuk menikmati fasilitas kami dan
              berpartisipasi dalam kegiatan olahraga.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Profesionalisme
            </h3>
            <p className="text-gray-600">
              Tim kami terdiri dari profesional berpengalaman yang berkomitmen
              untuk memberikan pelayanan terbaik dan memastikan kepuasan
              pelanggan dalam setiap interaksi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;

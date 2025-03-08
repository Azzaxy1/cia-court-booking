import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";

const Location = () => {
  return (
    <section className="py-16 md:px-12 bg-gray-50">
      <div className="container mx-auto ">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Temukan kami di lokasi strategis dan mudah diakses di pusat Kota
            Serang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2846.2618151206048!2d106.16661067498939!3d-6.1032890938831335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e41f4cf8fe80f27%3A0xb5197ff6fa7a5f0f!2sCIA%20Futsal!5e1!3m2!1sid!2sid!4v1741375703020!5m2!1sid!2sid"
              width="800"
              height="450"
              loading="lazy"
            ></iframe>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Alamat
                </h3>
                <p className="text-gray-600">
                  Jl. Cilampang, Unyur, Kec. Serang, Kota Serang, Banten 42111
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Jam Operasional
                </h3>
                <p className="text-gray-600">Setiap Hari: 07.00 - 23.00</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Reservasi
                </h3>
                <p className="text-gray-600">
                  Pemesanan dapat dilakukan melalui website, atau langsung di
                  lokasi (bergantung pada ketersediaan)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

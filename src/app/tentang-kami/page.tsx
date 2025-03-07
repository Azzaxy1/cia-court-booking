import React from "react";
import HeroAbout from "@/components/About/hero";
import OurStory from "@/components/About/our-story";
import ValuesSection from "@/components/About/values-section";
import Facilities from "@/components/About/facilities-section";
import CTA from "@/components/About/cta-section";
import Location from "@/components/About/location-section";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <HeroAbout />
      <OurStory />
      <ValuesSection />
      <Facilities />
      <CTA />

      {/* Stats */}
      <section className="py-16 px-4 bg-teal-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">5+</div>
              <p className="text-teal-100">Tahun Pengalaman</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">12</div>
              <p className="text-teal-100">Lapangan Olahraga</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50k+</div>
              <p className="text-teal-100">Pelanggan Puas</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <p className="text-teal-100">Turnamen Diselenggarakan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <Location />
    </div>
  );
};

export default AboutUs;

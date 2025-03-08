import AboutSection from "@/components/Home/about-section";
import Faq from "@/components/Home/faq";
import HeroSection from "@/components/Home/hero-section";
import HowToOrder from "@/components/Home/how-to-order";
import React from "react";

const HomePage = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <HowToOrder />
      <Faq />
    </main>
  );
};

export default HomePage;


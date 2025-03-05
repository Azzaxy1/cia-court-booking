import AboutSection from "@/components/Home/about-section";
import Faq from "@/components/Home/faq";
import HeroSection from "@/components/Home/hero-section";
import HowToOrder from "@/components/Home/how-to-order";
import React from "react";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HowToOrder />
      <Faq />
    </>
  );
};

export default HomePage;


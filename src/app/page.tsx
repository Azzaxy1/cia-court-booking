import AboutSection from "@/components/Home/about-section";
import HeroSection from "@/components/Home/hero-section";
import HowToOrder from "@/components/Home/how-to-order";
import React from "react";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HowToOrder />
    </>
  );
};

export default HomePage;


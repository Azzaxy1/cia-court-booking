import React from "react";
import HeroAbout from "@/components/About/hero";
import OurStory from "@/components/About/our-story";
import ValuesSection from "@/components/About/values-section";
import Facilities from "@/components/About/facilities-section";
import CTA from "@/components/About/cta-section";
import Location from "@/components/About/location-section";
import StatsSection from "@/components/About/stats-section";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <HeroAbout />
      <OurStory />
      <ValuesSection />
      <Facilities />
      <CTA />
      <StatsSection />
      <Location />
    </div>
  );
};

export default AboutUs;

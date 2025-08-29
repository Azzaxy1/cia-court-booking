import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/Home/hero-section";

const AboutSection = dynamic(() => import("@/components/Home/about-section"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse"></div>,
  ssr: true,
});

const HowToOrder = dynamic(() => import("@/components/Home/how-to-order"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse"></div>,
  ssr: true,
});

const Faq = dynamic(() => import("@/components/Home/faq"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse"></div>,
  ssr: true,
});

export const metadata = {
  title: "CIA Serang - Lapangan Olahraga Terbaik",
  description: "Sewa lapangan futsal, badminton, dan tenis meja dengan fasilitas terbaik di CIA Serang",
};

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
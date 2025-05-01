"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="mb-6 gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft size={16} />
      Kembali
    </Button>
  );
};

export default BackButton;

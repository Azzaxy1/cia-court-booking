"use client";

import React from "react";
import CourtForm from "@/components/Admin/Court/court-form";
import BackButton from "@/components/BackButton";
import { courtDummy } from "@/lib/dummy/court";
import { useParams } from "next/navigation";

const EditCourtPage = () => {
  const { id } = useParams();

  const court = courtDummy.find((court) => court.id === Number(id));

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <CourtForm court={court} />
    </div>
  );
};

export default EditCourtPage;

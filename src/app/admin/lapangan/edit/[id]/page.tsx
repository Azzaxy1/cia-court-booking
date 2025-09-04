import React from "react";
import CourtForm from "@/components/Admin/Court/court-form";
import BackButton from "@/components/BackButton";
import { getCourts } from "@/lib/db";

export const dynamic = 'force-dynamic';

const EditCourtPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const courts = await getCourts();

  const court = courts.find((court) => court.id === id);

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <CourtForm court={court} />
    </div>
  );
};

export default EditCourtPage;

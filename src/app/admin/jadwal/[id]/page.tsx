import React from "react";
import BackButton from "@/components/BackButton";
import { getCourtWithSchedule } from "@/lib/db";
import BulkGenerateForm from "@/components/Admin/Schedule/schedule-form";

const EditSchedulePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const courts = await getCourtWithSchedule();

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <BulkGenerateForm courts={courts} id={id} />
    </div>
  );
};

export default EditSchedulePage;

import React from "react";
import BulkGenerateForm from "@/components/Admin/Schedule/schedule-form";
import { getCourts } from "@/lib/db";
import BackButton from "@/components/BackButton";

export const dynamic = 'force-dynamic';

const AddSchedules = async () => {
  const courts = await getCourts();

  return (
    <section className="container  mx-auto pb-8">
      <BackButton />

      <BulkGenerateForm courts={courts} isAddForm />
    </section>
  );
};

export default AddSchedules;

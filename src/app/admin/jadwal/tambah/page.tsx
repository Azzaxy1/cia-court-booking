import React from "react";
import BulkGenerateForm from "@/components/Admin/Schedule/bulk-generate-form";
import { getCourts } from "@/lib/db";
import BackButton from "@/components/BackButton";

const AddSchedules = async () => {
  const courts = await getCourts();

  return (
    <section className="container  mx-auto pb-8">
      <BackButton />

      <BulkGenerateForm courts={courts} />
    </section>
  );
};

export default AddSchedules;

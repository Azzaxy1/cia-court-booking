import React from "react";
import BackButton from "@/components/BackButton";
import { getAllSchedules, getCourts } from "@/lib/db";
import BulkGenerateForm from "@/components/Admin/Schedule/schedule-form";
import { Schedule, Court } from "@/app/generated/prisma/client";

type CourtWithSchedule = Court & {
  Schedule: Schedule[];
};

type ScheduleWithCourt = Schedule & {
  Court: Court;
};

const EditSchedulePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const schedules = await getAllSchedules();
  const courts = await getCourts();

  const schedule = schedules.find((schedule) => schedule.id === id);

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <BulkGenerateForm
        schedule={schedule as unknown as ScheduleWithCourt}
        id={id}
        courts={courts as unknown as CourtWithSchedule[]}
      />
    </div>
  );
};

export default EditSchedulePage;

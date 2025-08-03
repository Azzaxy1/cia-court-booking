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

  if (!schedule) {
    return (
      <div className="container mx-auto pb-8">
        <BackButton />
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">
            Jadwal tidak ditemukan
          </h1>
          <p className="text-gray-600 mt-2">
            Jadwal dengan ID {id} tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  console.log("Schedule", schedule);

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <BulkGenerateForm
        schedule={schedule as unknown as ScheduleWithCourt}
        id={id}
        courts={courts as unknown as CourtWithSchedule[]}
        isAddForm={false}
      />
    </div>
  );
};

export default EditSchedulePage;

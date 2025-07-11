/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllSchedules, getScheduleStats } from "@/lib/db";
import ScheduleTable from "@/components/Admin/Schedule/schedule-table";

const ManageSchedule = async () => {
  const [rawSchedules, stats] = await Promise.all([
    getAllSchedules(),
    getScheduleStats(),
  ]);

  const schedules = rawSchedules.map((schedule) => ({
    ...schedule,
    court: {
      ...schedule.court,
      image: (schedule.court as any).image ?? "",
      description: (schedule.court as any).description ?? "",
      surfaceType: (schedule.court as any).surfaceType ?? null,
      capacity: (schedule.court as any).capacity ?? 0,
      isDeleted: (schedule.court as any).isDeleted ?? false,
      createdAt: (schedule.court as any).createdAt ?? new Date(),
      updatedAt: (schedule.court as any).updatedAt ?? new Date(),
    },
  }));

  return (
    <section className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
            Kelola Jadwal Lapangan
          </h1>
          <p className="text-gray-600 mt-2">
            Manage dan monitor jadwal lapangan dengan mudah
          </p>
        </div>
      </div>

      <ScheduleTable data={schedules} scheduleStats={stats} />
    </section>
  );
};

export default ManageSchedule;

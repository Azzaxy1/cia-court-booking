import { columns } from "@/components/Admin/Schedule/columns";

import { getAllSchedules } from "@/lib/db";
import ScheduleTable from "@/components/Admin/Schedule/schedule-table";

const ManageSchedule = async () => {
  const schedules = await getAllSchedules();

  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Jadwal Lapangan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4"></div>
        <ScheduleTable data={schedules} columns={columns} />
      </div>
    </section>
  );
};

export default ManageSchedule;

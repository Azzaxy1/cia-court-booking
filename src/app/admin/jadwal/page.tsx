import { columns } from "@/components/Admin/Schedule/columns";
import { ManageTable } from "@/components/ManageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllSchedules } from "@/lib/db";

const ManageSchedule = async () => {
  const schedules = await getAllSchedules();

  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Jadwal Lapangan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4">
          <Link href="/admin/jadwal/tambah">
            <Button className="bg-primary">
              <Plus size={16} />
              Tambah Jadwal
            </Button>
          </Link>
        </div>
        <ManageTable data={schedules} columns={columns} />
      </div>
    </section>
  );
};

export default ManageSchedule;

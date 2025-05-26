import { columns } from "@/components/Admin/Court/columns";
import { ManageTable } from "@/components/ManageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getCourts } from "@/lib/db";

const ManageCourt = async () => {
  const courts = await getCourts();
  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Lapangan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4">
          <Link href="/admin/lapangan/tambah">
            <Button className="bg-primary">
              <Plus size={16} />
              Tambah
            </Button>
          </Link>
        </div>
        <ManageTable data={courts} columns={columns} />
      </div>
    </section>
  );
};

export default ManageCourt;

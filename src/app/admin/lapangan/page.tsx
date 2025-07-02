import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getCourts } from "@/lib/db";
import CourtTable from "@/components/Admin/Court/court-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ManageCourt = async () => {
  const courts = await getCourts();
  const session = await getServerSession(authOptions);

  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Lapangan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4">
          {session?.user?.role === "CASHIER" && (
            <Link href="/admin/lapangan/tambah">
              <Button className="bg-primary">
                <Plus size={16} />
                Tambah
              </Button>
            </Link>
          )}
        </div>
        <CourtTable data={courts} role={session?.user.role ?? ""} />
      </div>
    </section>
  );
};

export default ManageCourt;

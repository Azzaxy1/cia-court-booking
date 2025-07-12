import React from "next";
import { getCourts } from "@/lib/db";
import CourtTable from "@/components/Admin/Court/court-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ManageCourt = async () => {
  const courts = await getCourts();
  const session = await getServerSession(authOptions);

  return (
    <section className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
            Kelola Lapangan
          </h1>
          <p className="text-gray-600 mt-2">
            Manage dan monitor lapangan olahraga dengan mudah
          </p>
        </div>
      </div>

      <CourtTable data={courts} role={session?.user.role ?? ""} />
    </section>
  );
};

export default ManageCourt;

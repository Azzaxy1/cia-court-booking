import React from "react";
import { columns } from "@/components/Admin/Pemesanan/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ManageTable } from "@/components/ManageTable";
import { getBookings } from "@/lib/db";

const ManageOrder = async () => {
  const bookings = await getBookings();
  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Pemesanan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4">
          <Link href="/admin/pemesanan/tambah">
            <Button className="bg-primary">
              <Plus size={16} />
              Tambah
            </Button>
          </Link>
        </div>
        <ManageTable data={bookings} columns={columns} />
      </div>
    </section>
  );
};

export default ManageOrder;

import { OrderTable } from "@/components/Admin/Pemesanan/order-table";
import React from "react";
import { ordersData } from "@/lib/dummy/orders";
import { columns } from "@/components/Admin/Pemesanan/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const ManageOrder = () => {
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
        <OrderTable data={ordersData} columns={columns} />
      </div>
    </section>
  );
};

export default ManageOrder;

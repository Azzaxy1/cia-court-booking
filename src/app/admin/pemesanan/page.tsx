import { OrderTable } from "@/components/Admin/Pemesanan/order-table";
import React from "react";
import { ordersData } from "@/lib/dummy/orders";
import { columns } from "@/components/Admin/Pemesanan/columns";

const ManageCourt = () => {
  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Pemesanan
      </h1>
      <div className="mt-6">
        <OrderTable data={ordersData} columns={columns} />
      </div>
    </section>
  );
};

export default ManageCourt;

import React from "react";
import { columns } from "@/components/Admin/Income/columns";
import { ordersData } from "@/lib/dummy/orders";
import IncomeTable from "@/components/Admin/Income/income-table";

const ManageIncome = () => {
  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Pemasukan
      </h1>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4"></div>
        <IncomeTable data={ordersData} columns={columns} />
      </div>
    </section>
  );
};

export default ManageIncome;

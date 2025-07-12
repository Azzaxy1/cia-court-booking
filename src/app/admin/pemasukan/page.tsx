import React from "react";
import { columns } from "@/components/Admin/Income/columns";
import { getTransactionsWithDetails, getCourtsForFilter } from "@/lib/db";
import IncomeTable from "@/components/Admin/Income/income-table";

const ManageIncome = async () => {
  const [transactions, courts] = await Promise.all([
    getTransactionsWithDetails(),
    getCourtsForFilter(),
  ]);

  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Monitor Pemasukan
      </h1>
      <p className="text-gray-600 mt-2">
        Manage dan monitor monitor pemasukan dengan mudah
      </p>
      <div className="mt-2 w-full">
        <div className="flex justify-end mb-4"></div>
        <IncomeTable data={transactions} columns={columns} courts={courts} />
      </div>
    </section>
  );
};

export default ManageIncome;

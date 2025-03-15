import React from "react";

interface LayoutDashboardProps {
  children: React.ReactNode;
  court: React.ReactNode;
  stats: React.ReactNode;
  orders: React.ReactNode;
}

export const dynamic = "force-dynamic";

const LayoutDashboard = ({
  children,
  court,
  stats,
  orders,
}: LayoutDashboardProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {children}
      {stats}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 my-4">
        {court}
        {orders}
      </div>
    </div>
  );
};

export default LayoutDashboard;

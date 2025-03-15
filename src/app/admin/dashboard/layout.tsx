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
    <>
      {children}
      {stats}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 my-4">
        {court}
        {orders}
      </div>
    </>
  );
};

export default LayoutDashboard;

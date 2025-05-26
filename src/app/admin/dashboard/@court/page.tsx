import React from "react";

import { getCourtStats } from "@/lib/db";
import CourtChartClient from "@/components/Admin/Dashboard/court-chart-client";

const CourtChart = async () => {
  const stats = await getCourtStats();

  const chartData = [
    { name: "Futsal", value: stats.Futsal, fill: "#2563eb" },
    { name: "Badminton", value: stats.Badminton, fill: "#60a5fa" },
    { name: "Tenis Meja", value: stats["Tenis Meja"], fill: "#f87171" },
  ];

  return <CourtChartClient chartData={chartData} />;
};

export default CourtChart;

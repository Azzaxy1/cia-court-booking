"use client";

import React from "react";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const chartData = [
  { name: "Futsal", value: 6, fill: "#2563eb" },
  { name: "Badminton", value: 7, fill: "#60a5fa" },
  { name: "Tenis Meja", value: 2, fill: "#f87171" },
];

const CourtChart = () => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Jumlah Lapangan</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="fill"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourtChart;

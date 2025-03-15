"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const OrdersChart = () => {
  const chartDataOrders = [
    { month: "January", futsal: 186, badminton: 80, tenisMeja: 20 },
    { month: "February", futsal: 305, badminton: 200, tenisMeja: 30 },
    { month: "March", futsal: 237, badminton: 120, tenisMeja: 10 },
    { month: "April", futsal: 73, badminton: 190, tenisMeja: 12 },
    { month: "May", futsal: 209, badminton: 130, tenisMeja: 8 },
    { month: "June", futsal: 214, badminton: 140, tenisMeja: 16 },
  ];

  const chartConfig = {
    futsal: {
      label: "Futsal",
      color: "#2563eb",
    },
    badminton: {
      label: "Badminton",
      color: "#60a5fa",
    },
    tenisMeja: {
      label: "Tenis Meja",
      color: "#f87171",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Total Pemesanan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartDataOrders}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="futsal" fill={chartConfig.futsal.color} radius={4} />
            <Bar
              dataKey="badminton"
              fill={chartConfig.badminton.color}
              radius={4}
            />
            <Bar
              dataKey="tenisMeja"
              fill={chartConfig.tenisMeja.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;

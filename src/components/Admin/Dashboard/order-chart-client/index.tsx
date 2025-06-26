"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { MonthlyData } from "@/lib/utils";

interface Props {
  chartConfig: ChartConfig;
  chartDataOrders: MonthlyData[];
}

const OrderChartClient = ({ chartConfig, chartDataOrders }: Props) => {
  console.log("chartDataOrders", chartDataOrders);
  console.log("chartConfig", chartConfig);

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

export default OrderChartClient;

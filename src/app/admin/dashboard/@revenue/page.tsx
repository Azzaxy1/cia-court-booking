import { ChartConfig } from "@/components/ui/chart";
import { getRevenueStats } from "@/lib/db";
import RevenueChartClient from "@/components/Admin/Dashboard/revenue-chart-client";
import { generateChartRevenue } from "@/lib/utils";

const RevenueChart = async () => {
  const revenueStats = await getRevenueStats();
  const chartDataRevenue = generateChartRevenue(revenueStats);

  const chartConfig = {
    futsal: {
      label: "Futsal",
      color: "#22c55e",
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
    <RevenueChartClient
      chartConfig={chartConfig}
      chartDataRevenue={chartDataRevenue}
    />
  );
};

export default RevenueChart;

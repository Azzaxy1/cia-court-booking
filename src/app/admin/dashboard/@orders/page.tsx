import OrderChartClient from "@/components/Admin/Dashboard/order-chart-client";
import { ChartConfig } from "@/components/ui/chart";
import { getOrderStats } from "@/lib/db";
import { generateChartData } from "@/lib/utils";

const OrdersChart = async () => {
  const orderStats = await getOrderStats();
  const chartDataOrders = generateChartData(orderStats);

  console.log(chartDataOrders);

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
    <OrderChartClient
      chartConfig={chartConfig}
      chartDataOrders={chartDataOrders}
    />
  );
};

export default OrdersChart;

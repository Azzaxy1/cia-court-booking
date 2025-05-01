"use client";

import { useParams } from "next/navigation";
import OrderForm from "@/components/Admin/Pemesanan/order-form";
import { ordersData } from "@/lib/dummy/orders";
import BackButton from "@/components/BackButton";

const EditOrderPage = () => {
  const { id } = useParams();

  const order = ordersData.find((order) => order.id === id);

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <OrderForm order={order} />
    </div>
  );
};

export default EditOrderPage;

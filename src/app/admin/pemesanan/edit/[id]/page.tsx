"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import OrderForm from "@/components/Admin/Pemesanan/order-form";
import { ordersData } from "@/lib/dummy/orders";

const EditOrderPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const order = ordersData.find((order) => order.id === id);

  return (
    <div className="container mx-auto pb-8">
      <Button
        variant="outline"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Kembali
      </Button>

      <OrderForm order={order} />
    </div>
  );
};

export default EditOrderPage;

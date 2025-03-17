"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import OrderForm from "@/components/Admin/Pemesanan/order-form";

const AddOrderPage = () => {
  const router = useRouter();

  return (
    <div className="container  mx-auto pb-8">
      <Button
        variant="outline"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Kembali
      </Button>

      <OrderForm isAddForm />
    </div>
  );
};

export default AddOrderPage;

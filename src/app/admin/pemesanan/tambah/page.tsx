import OrderForm from "@/components/Admin/Pemesanan/order-form";
import BackButton from "@/components/BackButton";
import { getCourtWithSchedule } from "@/lib/db";

const AddOrderPage = async () => {
  const courts = await getCourtWithSchedule();

  return (
    <div className="container  mx-auto pb-8">
      <BackButton />

      <OrderForm isAddForm courts={courts} />
    </div>
  );
};

export default AddOrderPage;

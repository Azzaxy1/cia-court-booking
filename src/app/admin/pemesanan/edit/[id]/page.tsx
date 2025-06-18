import OrderForm from "@/components/Admin/Pemesanan/order-form";
import BackButton from "@/components/BackButton";
import { getBookings, getCourtWithSchedule } from "@/lib/db";

const EditOrderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const bookings = await getBookings();
  const courts = await getCourtWithSchedule();

  const order = bookings.find((order) => order.id === id);

  return (
    <div className="container mx-auto pb-8">
      <BackButton />

      <OrderForm order={order} courts={courts} />
    </div>
  );
};

export default EditOrderPage;

import OrderForm from "@/components/Admin/Pemesanan/order-form";
import BackButton from "@/components/BackButton";
import { getCourtWithSchedule, getBookings } from "@/lib/db";

const AddOrderPage = async () => {
  const courts = await getCourtWithSchedule();
  const bookings = await getBookings();

  return (
    <div className="container  mx-auto pb-8">
      <BackButton />

      <OrderForm isAddForm courts={courts} orders={bookings} />
    </div>
  );
};

export default AddOrderPage;

import OrderForm from "@/components/Admin/Pemesanan/order-form";
import BackButton from "@/components/BackButton";

const AddOrderPage = () => {
  return (
    <div className="container  mx-auto pb-8">
      <BackButton />

      <OrderForm isAddForm />
    </div>
  );
};

export default AddOrderPage;

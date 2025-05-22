import axios from "axios";

interface PaymentDetail {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export const paymentMidtrans = async (paymentDetail: PaymentDetail) => {
  const res = await axios.post("/api/midtrans", paymentDetail, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.data;
  return data;
};

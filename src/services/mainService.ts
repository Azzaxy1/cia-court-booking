import axios from "axios";

export const paymentMidtrans = async (
  paymentDetail: Record<string, string | number | object>
) => {
  const res = await axios.post("/api/midtrans", paymentDetail, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.data;
  return data;
};

export const getCourtSchedule = async (courtId: string, date: string) => {
  const res = await axios.get(`/api/courts/${courtId}/schedule?date=${date}`);
  return res;
};

export const createBooking = async (
  bookingDetail: Record<string, string | number>
) => {
  const res = await axios.post("/api/bookings", bookingDetail, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("Gagal membuat booking");
  }

  return res.data;
};

export const getPaymentDetail = async (orderId: string) => {
  const res = await axios.get(`/api/payment/detail?order_id=${orderId}`);

  if (res.status !== 200) {
    throw new Error("Gagal mendapatkan detail pembayaran");
  }

  return res.data;
};

export const createCourt = async (formData: FormData) => {
  const res = await axios.post("/api/admin/court", formData);
  if (res.status !== 201) {
    throw new Error("Gagal menambahkan lapangan");
  }
  return res.data;
};

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

export const createBooking = async (
  bookingDetail: Record<string, string | number | null | boolean>
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

export const updateBooking = async (
  data: Record<string, string | number | null | boolean>
) => {
  const res = await axios.put(`/api/bookings/${data.id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("Gagal mengupdate booking");
  }

  return res.data;
};

export const deleteBooking = async (id: string) => {
  const res = await axios.delete(`/api/bookings/${id}`);

  if (res.status !== 200) {
    throw new Error("Gagal menghapus booking");
  }

  return res.data;
};

export const getPaymentDetail = async (orderId: string) => {
  const res = await axios.get(`/api/payment/detail?order_id=${orderId}`);

  if (res.status !== 200) {
    throw new Error("Gagal mbendapatkan detail pembayaran");
  }

  return res.data;
};

export const getRecurringBookings = async () => {
  try {
    const res = await axios.get("/api/admin/recurring-bookings");

    if (res.status !== 200) {
      throw new Error("Gagal mendapatkan data pemesanan berulang");
    }

    return res.data;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

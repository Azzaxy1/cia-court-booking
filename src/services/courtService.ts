import axios from "axios";

export const createCourt = async (formData: FormData) => {
  const res = await axios.post("/api/admin/court", formData);
  if (res.status !== 201) {
    throw new Error("Gagal menambahkan lapangan");
  }
  return res.data;
};

export const deleteCourt = async (courtId: string) => {
  const res = await axios.delete(`/api/admin/court/${courtId}`);
  if (res.status !== 200) {
    throw new Error("Gagal menghapus lapangan");
  }
  return res.data;
};

export const getCourtSchedule = async (courtId: string, date: string) => {
  const res = await axios.get(`/api/courts/${courtId}/schedule?date=${date}`);
  return res;
};

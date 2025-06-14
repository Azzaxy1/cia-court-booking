import axios from "axios";

export const deleteSchedule = async (scheduleId: string) => {
  const res = await axios.delete(`/api/admin/schedule/${scheduleId}`);
  if (res.status !== 200) {
    throw new Error("Gagal menghapus jadwal");
  }
  return res.data;
};

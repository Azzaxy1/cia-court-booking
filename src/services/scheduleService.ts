import axios from "axios";

export const deleteSchedule = async (scheduleId: string) => {
  const res = await axios.delete(`/api/admin/schedule/${scheduleId}`);
  if (res.status !== 200) {
    throw new Error("Gagal menghapus jadwal");
  }
  return res.data;
};

export const createSchedule = async (
  scheduleData: Record<string, string | number | object>
) => {
  const res = await axios.post("/api/admin/schedule", scheduleData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("Gagal membuat jadwal");
  }
  return res.data;
};

export const updateSchedule = async (
  scheduleId: string,
  scheduleData: Record<string, string | number | string[] | object[]>
) => {
  const res = await axios.put(
    `/api/admin/schedule/${scheduleId}`,
    scheduleData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status !== 200) {
    throw new Error("Gagal memperbarui jadwal");
  }

  return res.data;
};

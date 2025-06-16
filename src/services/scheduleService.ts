import axios from "axios";

export type SchedulePayload = {
  courtId: string;
  days?: number;
  date?: string;
  timeSlot: string[] | string;
  price: number;
  dayType: string;
  id?: string;
};

export const deleteSchedule = async (scheduleId: string) => {
  const res = await axios.delete(`/api/admin/schedule/${scheduleId}`);
  if (res.status !== 200) {
    throw new Error("Gagal menghapus jadwal");
  }
  return res.data;
};

export const createSchedule = async (scheduleData: SchedulePayload) => {
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
  scheduleData: SchedulePayload
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

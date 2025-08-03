"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Court, Schedule } from "@/app/generated/prisma";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { scheduleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  SchedulePayload,
  createSchedule,
  updateSchedule,
} from "@/services/scheduleService";
import { useRouter } from "next/navigation";

type ScheduleFormType = z.infer<typeof scheduleSchema>;

type CourtWithSchedule = Court & {
  Schedule: Schedule[];
};

type ScheduleWithCourt = Schedule & {
  Court: Court;
};
interface Props {
  courts?: CourtWithSchedule[];
  id?: string;
  isAddForm?: boolean;
  schedule?: ScheduleWithCourt;
}

const TIME_PRESETS = {
  pagi: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  siang: ["14:00", "15:00", "16:00", "17:00", "18:00"],
  malam: ["19:00", "20:00", "21:00", "22:00", "23:00"],
};

const ScheduleForm = ({ courts, id, isAddForm, schedule }: Props) => {
  const router = useRouter();

  // const getNameCourtById = (courtId: string | undefined) => {
  //   const court = courts?.find((court) => court.id === courtId);
  //   return court ? court.name : "Lapangan tidak ditemukan";
  // };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      courtId: isAddForm ? "" : schedule?.courtId || "",
      days: 1,
      price: schedule?.price || 0,
      dayType: schedule?.dayType || "Weekday",
      timePreset: "pagi",
      startTime: schedule?.timeSlot || "",
      endTime: schedule?.timeSlot || "",
      date: schedule?.date ? schedule.date.toISOString().split("T")[0] : "",
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      toast.success(
        "Berhasil membuat jadwal baru sebanyak " + data.count + " slot!"
      );
      router.push("/admin/jadwal");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Gagal membuat jadwal");
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({
      scheduleId,
      scheduleData,
    }: {
      scheduleId: string;
      scheduleData: SchedulePayload;
    }) => updateSchedule(scheduleId, scheduleData),
    onSuccess: () => {
      toast.success("Jadwal berhasil diperbarui!");
      router.push("/admin/jadwal");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Gagal memperbarui");
    },
  });

  const onSubmit = async (data: ScheduleFormType) => {
    if (isAddForm) {
      const payload = {
        courtId: data.courtId,
        days: data.days,
        price: data.price,
        dayType: data.dayType,
        timeSlot: TIME_PRESETS[data.timePreset as keyof typeof TIME_PRESETS],
      };
      createScheduleMutation.mutate(payload);
    } else {
      if (id && schedule) {
        const payload = {
          courtId: data.courtId,
          date: data.date || schedule.date.toISOString(),
          timeSlot: data.startTime || schedule.timeSlot,
          price: data.price,
          dayType: data.dayType,
        };
        updateScheduleMutation.mutate({
          scheduleId: id,
          scheduleData: payload,
        });
      } else {
        toast.error("ID jadwal tidak ditemukan");
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isAddForm ? "Generate Jadwal Baru" : "Edit Jadwal Lapangan"}
        </CardTitle>
        <CardDescription>
          {isAddForm
            ? "Isi form berikut untuk membuat jadwal baru."
            : "Ubah detail jadwal lapangan di bawah ini."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Court Selection */}
          <div className="space-y-2">
            <Label htmlFor="court">Lapangan</Label>
            <Select
              value={watch("courtId")}
              onValueChange={(value) => setValue("courtId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lapangan" />
              </SelectTrigger>
              <SelectContent>
                {courts?.map((court) => (
                  <SelectItem key={court.id} value={court.id}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courtId && (
              <p className="text-red-500 text-sm">{errors.courtId.message}</p>
            )}
          </div>

          {/* Days and Day Type */}
          {isAddForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="days">Jumlah Hari</Label>
                <Input
                  id="days"
                  type="number"
                  {...register("days", { valueAsNumber: true })}
                  placeholder="Jumlah hari"
                  min={1}
                  max={30}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setValue("days", value);
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dayType">Tipe Hari</Label>
                <Select
                  value={watch("dayType")}
                  onValueChange={(value) =>
                    setValue("dayType", value as "Weekday" | "Weekend")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe hari" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekday">Weekday</SelectItem>
                    <SelectItem value="Weekend">Weekend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Edit Mode: Date and Time */}
          {!isAddForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input id="date" type="date" {...register("date")} required />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Jam</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime")}
                  placeholder="Jam mulai"
                  required
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isAddForm && (
            <div className="space-y-2">
              <Label htmlFor="dayType">Tipe Hari</Label>
              <Select
                value={watch("dayType")}
                onValueChange={(value) =>
                  setValue("dayType", value as "Weekday" | "Weekend")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekday">Weekday</SelectItem>
                  <SelectItem value="Weekend">Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time Slots - Only for Add Mode */}
          {isAddForm && (
            <div className="space-y-2">
              <Label htmlFor="preset">Preset Jam Operasional</Label>
              <Select
                value={watch("timePreset")}
                onValueChange={(value) => {
                  const selectedPreset = value as keyof typeof TIME_PRESETS;
                  setValue("timePreset", selectedPreset);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih preset jam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagi">Pagi (07:00-13:00)</SelectItem>
                  <SelectItem value="siang">Siang (14:00-18:00)</SelectItem>
                  <SelectItem value="malam">Malam (19:00-23:00)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Pilih preset untuk mengisi jam otomatis, atau isi manual di
                bawah.
              </p>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Harga per Jam</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="Harga per jam"
                min={0}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < 0) {
                    toast.error("Harga tidak boleh kurang dari 0");
                    return;
                  }
                  setValue("price", value);
                }}
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Harga yang akan diterapkan: Rp {watch("price").toLocaleString()}
            </p>
          </div>

          {/* Summary */}
          {isAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Ringkasan Generate:</h4>
              <div className="text-sm space-y-1">
                <p>
                  • Lapangan:{" "}
                  {courts?.find((c) => c.id === watch("courtId"))?.name ||
                    "Belum dipilih"}
                </p>
                <p>• Jumlah hari: {watch("days")} hari</p>
                <p>• Tipe hari: {watch("dayType")}</p>
                <p>
                  • Jumlah slot waktu:{" "}
                  {TIME_PRESETS[
                    watch("timePreset") as keyof typeof TIME_PRESETS
                  ]?.length || 0}{" "}
                  slot
                </p>
                <p>• Harga per jam: Rp {watch("price").toLocaleString()}</p>
                <p>
                  • Total jadwal yang akan dibuat:{" "}
                  <strong>
                    {(watch("days") || 1) *
                      (TIME_PRESETS[
                        watch("timePreset") as keyof typeof TIME_PRESETS
                      ]?.length || 0)}{" "}
                    slot
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Edit Summary */}
          {!isAddForm && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Detail Jadwal:</h4>
              <div className="text-sm space-y-1">
                <p>
                  • Lapangan:{" "}
                  {courts?.find((c) => c.id === watch("courtId"))?.name ||
                    "Belum dipilih"}
                </p>
                <p>• Tanggal: {watch("date") || "Belum diisi"}</p>
                <p>• Jam: {watch("startTime") || "Belum diisi"}</p>
                <p>• Tipe hari: {watch("dayType")}</p>
                <p>• Harga per jam: Rp {watch("price").toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={
              createScheduleMutation.isPending ||
              updateScheduleMutation.isPending
            }
          >
            {createScheduleMutation.isPending ||
            updateScheduleMutation.isPending
              ? "Memproses..."
              : isAddForm
              ? "Simpan Jadwal"
              : "Update Jadwal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ScheduleForm;

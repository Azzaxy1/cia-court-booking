"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa";
import { getCourtSchedule } from "@/services/courtService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { orderSchema } from "@/validation";
import { createBooking } from "@/services/mainService";
import toast from "react-hot-toast";
import { Booking, Court, Schedule, User } from "@/app/generated/prisma";

type OrderFormType = z.infer<typeof orderSchema>;

type CourtWithSchedule = Court & {
  Schedule: Schedule[];
};

export interface BookingWithUser extends Booking {
  user: User;
  court: Court;
}

interface Props {
  courts: CourtWithSchedule[];
  isAddForm?: boolean;
  orders?: BookingWithUser[];
}

const OrderForm = ({ courts, isAddForm, orders }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      courtId: "",
      selectedDate: undefined,
      selectedSchedule: null,
    },
  });

  const { data: schedules = [], isLoading } = useQuery<Schedule[]>({
    queryKey: [
      "schedules",
      watch("courtId"),
      watch("selectedDate")?.toISOString(),
    ],
    queryFn: async () => {
      if (!watch("courtId") || !watch("selectedDate")) return [];
      const selectedDate = watch("selectedDate");
      if (!selectedDate) return [];

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const res = await getCourtSchedule(watch("courtId"), formattedDate);
      return res.data;
    },
    enabled: !!watch("courtId") && !!watch("selectedDate"),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Pemesanan berhasil dibuat");
      router.push("/admin/pemesanan");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: OrderFormType) => {
    mutate({
      scheduleId: data.selectedSchedule?.id ?? "",
      customerName: data.customerName,
      courtId: data.courtId,
      price: data.selectedSchedule?.price ?? 0,
      selectedScheduleId: data.selectedSchedule?.id ?? null,
      selectedDate: data.selectedDate
        ? `${data.selectedDate.getFullYear()}-${(
            data.selectedDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${data.selectedDate
            .getDate()
            .toString()
            .padStart(2, "0")}`
        : "",
      amount: data.selectedSchedule?.price ?? 0,
      startTime: data.selectedSchedule?.timeSlot ?? "",
      duration: 1,
      status: "Paid",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isAddForm ? "Tambah Pemesanan" : "Edit Pemesanan"}
        </CardTitle>
        <CardDescription>
          {isAddForm
            ? "Isi form berikut untuk membuat pemesanan baru."
            : "Edit detail pemesanan yang sudah ada."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label>Nama Lapangan</Label>
            <Input
              {...register("customerName", { required: true })}
              placeholder="Masukkan nama pelanggan"
              required
            />
            {errors.customerName && (
              <span className="text-red-500">
                {errors.customerName.message}
              </span>
            )}
          </div>
          <div>
            <Label>Lapangan</Label>
            <Select
              value={watch("courtId")}
              onValueChange={(value) => setValue("courtId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lapangan" />
              </SelectTrigger>
              <SelectContent>
                {courts.map((court) => (
                  <SelectItem key={court.id} value={court.id}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tanggal</Label>
            <Calendar
              mode="single"
              selected={watch("selectedDate")}
              onSelect={(date) => setValue("selectedDate", date)}
              disabled={(date) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return date < now;
              }}
            />
          </div>
          <div>
            <Label>Jadwal</Label>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Memuat jadwal...
              </div>
            ) : schedules.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {schedules.map((schedule) => (
                  <Button
                    key={schedule.id}
                    type="button"
                    variant={
                      watch("selectedSchedule")?.id === schedule.id
                        ? "default"
                        : schedule.available
                        ? "outline"
                        : "secondary"
                    }
                    disabled={!schedule.available}
                    onClick={() => setValue("selectedSchedule", schedule)}
                  >
                    {schedule.timeSlot} <br />
                    <span className="text-xs text-gray-500">
                      Rp {schedule.price.toLocaleString("id-ID")}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-red-500">Tidak ada jadwal tersedia</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={
              isPending ||
              !watch("customerName") ||
              !watch("courtId") ||
              !watch("selectedSchedule")
            }
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Memproses...
              </span>
            ) : (
              "Simpan Pemesanan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OrderForm;

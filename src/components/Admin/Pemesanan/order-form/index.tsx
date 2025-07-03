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
import { createBooking, updateBooking } from "@/services/mainService";
import toast from "react-hot-toast";
import {
  Booking,
  BookingStatus,
  Court,
  Schedule,
  User,
} from "@/app/generated/prisma";

type OrderFormType = z.infer<typeof orderSchema>;

type CourtWithSchedule = Court & {
  Schedule: Schedule[];
};

export interface BookingWithUser extends Booking {
  user: User;
  court: Court;
  Schedule: Schedule[];
}

interface Props {
  courts?: CourtWithSchedule[];
  isAddForm?: boolean;
  order?: BookingWithUser;
}

const OrderForm = ({ courts, isAddForm, order }: Props) => {
  const router = useRouter();

  console.log("OrderForm rendered", order);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: order?.user?.name || "",
      courtId: order?.court?.id || "",
      selectedDate: order?.date ? new Date(order.date) : undefined,
      selectedSchedule: order?.Schedule?.[0]
        ? {
            id: order.Schedule[0].id,
            timeSlot: order.Schedule[0].timeSlot,
            price: order.Schedule[0].price,
            available: order.Schedule[0].available,
          }
        : undefined,
      status: order?.status || "Paid",
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

  const { mutate: createMutate, isPending: isCreatePending } = useMutation({
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

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateBooking,
    onSuccess: (data) => {
      toast.success("Pemesanan berhasil diperbarui");
      reset({
        customerName: data.user.name,
        courtId: data.courtId,
        selectedDate: new Date(data.date),
        selectedSchedule: {
          id: data.scheduleId,
          timeSlot: data.startTime,
          price: data.amount,
          available: true,
        },
      });
      router.push("/admin/pemesanan");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: OrderFormType) => {
    const bookingData = {
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
    };

    if (isAddForm) {
      createMutate(bookingData);
    } else {
      if (!order?.id) {
        toast.error("ID pemesanan tidak ditemukan");
        return;
      }
      updateMutate({ ...bookingData, id: order.id });
    }
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
        {!isAddForm && order?.status === "Paid" && (
          <div className="text-yellow-600 bg-yellow-50 p-2 rounded-md">
            Pemesanan ini sudah dibayar dan tidak dapat diubah
          </div>
        )}
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
                {courts?.map((court) => (
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
          {!isAddForm && order?.status !== "Paid" && (
            <div>
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as BookingStatus)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BookingStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={
              isCreatePending ||
              isUpdatePending ||
              !watch("customerName") ||
              !watch("courtId") ||
              !watch("selectedSchedule") ||
              (!isAddForm && order?.status === "Paid")
            }
          >
            {isCreatePending || isUpdatePending ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Memproses...
              </span>
            ) : isAddForm ? (
              "Simpan Pemesanan"
            ) : (
              "Update Pemesanan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OrderForm;

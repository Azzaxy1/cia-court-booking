"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/app/generated/prisma";
import { calculateEndTime } from "@/lib/utils";

type OrderFormType = z.infer<typeof orderSchema>;

type CourtWithSchedule = Court & {
  Schedule: Schedule[];
};

export interface BookingWithUser extends Booking {
  user: {
    id: string;
    name: string;
    email: string;
  };
  court: Court;
}

interface Props {
  courts?: CourtWithSchedule[];
  isAddForm?: boolean;
  order?: BookingWithUser;
}

const OrderForm = ({ courts, isAddForm, order }: Props) => {
  const router = useRouter();

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
      selectedSchedule: order
        ? {
            id: "", // Will be populated when schedules are loaded
            timeSlot: order.startTime,
            price: order.amount,
            available: true,
          }
        : undefined,
      status: order?.status || "Paid",
      paymentMethod: "Cash", // Default payment method
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
    const endTime = calculateEndTime(data.selectedSchedule?.timeSlot || "", 1);

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
      endTime: endTime,
      duration: 1,
      status: data.status as BookingStatus,
      paymentMethod: data.paymentMethod || "Cash",
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
        {!isAddForm && order && (
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">
              Pemesanan Saat Ini:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-700">Jadwal Lama:</span>
                <Badge variant="outline" className="ml-2">
                  {order.startTime} - {order.endTime}
                </Badge>
              </div>
              <div>
                <span className="text-blue-700">Lapangan:</span>
                <span className="ml-2">{order.court.name}</span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label>Nama Pelanggan</Label>
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
            {watch("selectedSchedule") && (
              <div className="mb-2 p-2 bg-green-50 rounded-md text-white">
                <span className="text-green-700 text-sm">Jadwal Dipilih: </span>
                <Badge variant="default">
                  {watch("selectedSchedule")?.timeSlot} -{" "}
                  {calculateEndTime(
                    watch("selectedSchedule")?.timeSlot || "",
                    1
                  )}
                </Badge>
                <span className="text-green-700 text-sm ml-2">
                  (Rp {watch("selectedSchedule")?.price.toLocaleString("id-ID")}
                  )
                </span>
              </div>
            )}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Memuat jadwal...
              </div>
            ) : schedules.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {schedules.map((schedule) => {
                  const isSelected =
                    watch("selectedSchedule")?.id === schedule.id;
                  const endTime = calculateEndTime(schedule.timeSlot, 1);

                  return (
                    <Button
                      key={schedule.id}
                      type="button"
                      variant={
                        isSelected
                          ? "default"
                          : schedule.available
                          ? "outline"
                          : "secondary"
                      }
                      disabled={!schedule.available && !isSelected} // ✅ ALLOW CURRENT SELECTED EVEN IF NOT AVAILABLE
                      onClick={() => setValue("selectedSchedule", schedule)}
                      className="h-auto p-3 flex flex-col items-center"
                    >
                      <div className="font-medium">
                        {schedule.timeSlot} - {endTime}
                      </div>
                      <div className="text-xs mt-1">
                        Rp {schedule.price.toLocaleString("id-ID")}
                      </div>
                      {!schedule.available && !isSelected && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Terbooked
                        </Badge>
                      )}
                      {isSelected && (
                        <Badge variant="default" className="mt-1 text-xs">
                          Dipilih
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="text-red-500">Tidak ada jadwal tersedia</div>
            )}
          </div>
          {!isAddForm && (
            <>
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

              {watch("status") === "Canceled" && order?.status === "Paid" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <span className="text-sm font-medium">⚠️ Peringatan:</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Anda akan membatalkan pemesanan yang sudah dibayar. Jadwal
                    akan dibebaskan dan transaksi akan diubah ke status failed.
                  </p>
                </div>
              )}

              {watch("status") === "Paid" && (
                <div>
                  <Label>Metode Pembayaran</Label>
                  <Select
                    value={watch("paymentMethod") || "Cash"}
                    onValueChange={(value) =>
                      setValue(
                        "paymentMethod",
                        value as "Cash" | "bank_transfer" | "credit_card"
                      )
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash (Tunai)</SelectItem>
                      <SelectItem value="bank_transfer">
                        Transfer Bank
                      </SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
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
              !watch("selectedSchedule")
              // (!isAddForm && order?.status === "Paid")
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

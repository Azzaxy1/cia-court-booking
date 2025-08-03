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
import { useEffect } from "react";
import { id } from "date-fns/locale";

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
      bookingType: "single" as "single" | "recurring",
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

  // Update recurring form data when schedule is selected
  const selectedSchedule = watch("selectedSchedule");
  const selectedDate = watch("selectedDate");
  const bookingType = watch("bookingType");

  useEffect(() => {
    if (selectedSchedule && bookingType === "recurring") {
      if (selectedDate) {
        const dayOfWeek = selectedDate.getDay();
        // Convert JavaScript getDay() (0-6, Sun-Sat) to our system (1-7, Mon-Sun)
        const ourDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        setValue("dayOfWeek", ourDayOfWeek);
        setValue("recurringTimeSlot", selectedSchedule?.timeSlot || "");

        // Set default start date to selected date
        setValue("startDate", selectedDate);

        // Set default end date to 30 days from start date
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 30);
        setValue("endDate", endDate);
      }
    }
  }, [selectedSchedule, selectedDate, bookingType, setValue]);

  // Function to calculate recurring sessions
  const calculateRecurringSessions = (startDate: Date, endDate: Date, dayOfWeek: number) => {
    const sessions: Date[] = [];
    const current = new Date(startDate);
    
    // Convert our dayOfWeek (1-7, Mon-Sun) to JavaScript getDay() (0-6, Sun-Sat)
    const targetDay = dayOfWeek === 7 ? 0 : dayOfWeek;
    
    // Adjust to the first occurrence of the target day
    while (current.getDay() !== targetDay) {
      current.setDate(current.getDate() + 1);
    }
    
    // Generate all dates until end date
    while (current <= endDate) {
      sessions.push(new Date(current));
      current.setDate(current.getDate() + 7); // Add 7 days for next week
    }
    
    return sessions;
  };

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

  const { mutate: createRecurringMutate, isPending: isRecurringPending } =
    useMutation({
      mutationFn: async (data: {
        customerName: string;
        courtId: string;
        dayOfWeek: number;
        startDate: Date;
        endDate: Date;
        timeSlot: string;
      }) => {
        const response = await fetch("/api/admin/recurring-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: data.customerName,
            courtId: data.courtId,
            dayOfWeek: data.dayOfWeek,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            timeSlot: data.timeSlot,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create recurring booking");
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Pemesanan berulang berhasil dibuat");
        router.push("/admin/pemesanan-berulang");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSubmit = async (data: OrderFormType) => {
    if (data.bookingType === "recurring") {
      // Handle recurring booking - use selectedSchedule data
      if (!selectedSchedule) {
        toast.error("Silakan pilih jadwal terlebih dahulu");
        return;
      }
      
      const recurringData = {
        customerName: data.customerName,
        courtId: data.courtId,
        dayOfWeek: data.dayOfWeek!,
        startDate: data.startDate!,
        endDate: data.endDate!,
        timeSlot: selectedSchedule.timeSlot,
      };
      createRecurringMutate(recurringData);
    } else {
      // Handle single booking
      const endTime = calculateEndTime(
        data.selectedSchedule?.timeSlot || "",
        1
      );

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

          {isAddForm && (
            <div>
              <Label>Tipe Pemesanan</Label>
              <Select
                value={watch("bookingType")}
                onValueChange={(value) =>
                  setValue("bookingType", value as "single" | "recurring")
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe pemesanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Pemesanan Sekali</SelectItem>
                  <SelectItem value="recurring">Pemesanan Berulang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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

          {/* Single Booking Fields */}
          {(!isAddForm || watch("bookingType") === "single") && (
            <>
              <div>
                <Label>Tanggal</Label>
                <Calendar
                  mode="single"
                  selected={watch("selectedDate")}
                  onSelect={(date) => setValue("selectedDate", date)}
                  className="w-full md:w-1/2 mx-auto flex justify-center"
                  locale={id}
                  initialFocus={true}
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
                    <span className="text-green-700 text-sm">
                      Jadwal Dipilih:{" "}
                    </span>
                    <Badge variant="default">
                      {watch("selectedSchedule")?.timeSlot} -{" "}
                      {calculateEndTime(
                        watch("selectedSchedule")?.timeSlot || "",
                        1
                      )}
                    </Badge>
                    <span className="text-green-700 text-sm ml-2">
                      (Rp{" "}
                      {watch("selectedSchedule")?.price.toLocaleString("id-ID")}
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
                            <Badge
                              variant="destructive"
                              className="mt-1 text-xs"
                            >
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
            </>
          )}

          {/* Recurring Booking Fields */}
          {isAddForm && bookingType === "recurring" && (
            <>
              {/* First, let user select schedule like normal booking */}
              <div>
                <Label>Tanggal Referensi (untuk menentukan hari dan jam)</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setValue("selectedDate", date)}
                  className="w-full md:w-1/2 mx-auto flex justify-center"
                  locale={id}
                  initialFocus={true}
                  disabled={(date) => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    return date < now;
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Pilih tanggal untuk menentukan hari dalam seminggu dan melihat
                  jadwal tersedia
                </p>
              </div>

              {selectedDate && (
                <div>
                  <Label>Jadwal yang Dipilih</Label>
                  {watch("selectedSchedule") && (
                    <div className="mb-2 p-2 bg-green-50 rounded-md">
                      <span className="text-green-700 text-sm">
                        Jadwal Dipilih:{" "}
                      </span>
                      <Badge variant="default">
                        {watch("selectedSchedule")?.timeSlot} -{" "}
                        {calculateEndTime(
                          watch("selectedSchedule")?.timeSlot || "",
                          1
                        )}
                      </Badge>
                      <span className="text-green-700 text-sm ml-2">
                        (Rp{" "}
                        {watch("selectedSchedule")?.price.toLocaleString(
                          "id-ID"
                        )}
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
                            disabled={!schedule.available && !isSelected}
                            onClick={() =>
                              setValue("selectedSchedule", schedule)
                            }
                            className="h-auto p-3 flex flex-col items-center"
                          >
                            <div className="font-medium">
                              {schedule.timeSlot} - {endTime}
                            </div>
                            <div className="text-xs mt-1">
                              Rp {schedule.price.toLocaleString("id-ID")}
                            </div>
                            {!schedule.available && !isSelected && (
                              <Badge
                                variant="destructive"
                                className="mt-1 text-xs"
                              >
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
                    <div className="text-red-500">
                      Tidak ada jadwal tersedia
                    </div>
                  )}
                </div>
              )}

              {/* Recurring period settings */}
              {selectedSchedule && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Pengaturan Otomatis:
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>Hari terpilih:</strong>{" "}
                        {
                          [
                            "Minggu",
                            "Senin",
                            "Selasa",
                            "Rabu",
                            "Kamis",
                            "Jumat",
                            "Sabtu",
                          ][selectedDate?.getDay() || 0]
                        }
                      </p>
                      <p>
                        <strong>Waktu:</strong> {selectedSchedule?.timeSlot}
                      </p>
                      <p>
                        <strong>Harga per sesi:</strong> Rp{" "}
                        {selectedSchedule?.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tanggal Mulai Berulang</Label>
                      <Calendar
                        mode="single"
                        selected={watch("startDate")}
                        onSelect={(date) => setValue("startDate", date)}
                        className="w-full flex justify-center"
                        locale={id}
                        initialFocus={true}
                        disabled={(date) => {
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          return date < now;
                        }}
                      />
                      {errors.startDate && (
                        <span className="text-red-500 text-sm">
                          {errors.startDate.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label>Tanggal Selesai Berulang</Label>
                      <Calendar
                        mode="single"
                        selected={watch("endDate")}
                        onSelect={(date) => setValue("endDate", date)}
                        className="w-full flex justify-center"
                        locale={id}
                        initialFocus={true}
                        disabled={(date) => {
                          const now = new Date();
                          const startDate = watch("startDate");
                          now.setHours(0, 0, 0, 0);
                          if (date < now) return true;
                          if (startDate && date <= startDate) return true;
                          return false;
                        }}
                      />
                      {errors.endDate && (
                        <span className="text-red-500 text-sm">
                          {errors.endDate.message}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Preview untuk recurring booking */}
              {watch("startDate") &&
                watch("endDate") &&
                watch("dayOfWeek") &&
                selectedSchedule && (
                  (() => {
                    const startDate = watch("startDate")!;
                    const endDate = watch("endDate")!;
                    const dayOfWeek = watch("dayOfWeek")!;
                    const sessions = calculateRecurringSessions(startDate, endDate, dayOfWeek);
                    const totalPrice = sessions.length * selectedSchedule.price;
                    
                    return (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <h4 className="font-medium text-green-900 mb-3">
                          Preview Pemesanan Berulang:
                        </h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                            <div>
                              <p>
                                <strong>Hari:</strong>{" "}
                                {
                                  [
                                    "",
                                    "Senin",
                                    "Selasa",
                                    "Rabu",
                                    "Kamis",
                                    "Jumat",
                                    "Sabtu",
                                    "Minggu",
                                  ][dayOfWeek]
                                }
                              </p>
                              <p>
                                <strong>Waktu:</strong> {selectedSchedule.timeSlot}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Jumlah Sesi:</strong> {sessions.length} kali
                              </p>
                              <p>
                                <strong>Harga per Sesi:</strong> Rp{" "}
                                {selectedSchedule.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t border-green-300 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg text-green-800">Total Harga:</span>
                              <span className="font-bold text-xl text-green-600">
                                Rp {totalPrice.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                            <p>
                              <strong>Periode:</strong>{" "}
                              {startDate.toLocaleDateString("id-ID")} -{" "}
                              {endDate.toLocaleDateString("id-ID")}
                            </p>
                            <p className="mt-1">
                              <strong>Jadwal:</strong> Setiap {
                                [
                                  "",
                                  "Senin",
                                  "Selasa", 
                                  "Rabu",
                                  "Kamis",
                                  "Jumat",
                                  "Sabtu",
                                  "Minggu",
                                ][dayOfWeek]
                              } jam {selectedSchedule.timeSlot}
                            </p>
                            {sessions.length <= 8 && (
                              <div className="mt-2">
                                <strong>Tanggal booking:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sessions.map((session, index) => (
                                    <span 
                                      key={index}
                                      className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
                                    >
                                      {session.toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short"
                                      })}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {sessions.length > 8 && (
                              <p className="mt-2 text-xs">
                                <strong>Tanggal pertama:</strong> {sessions[0].toLocaleDateString("id-ID")} <br/>
                                <strong>Tanggal terakhir:</strong> {sessions[sessions.length - 1].toLocaleDateString("id-ID")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
            </>
          )}
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
              isRecurringPending ||
              !watch("customerName") ||
              !watch("courtId") ||
              (bookingType === "single" && !selectedSchedule) ||
              (bookingType === "recurring" &&
                (!watch("startDate") || !watch("endDate") || !selectedSchedule))
              // (!isAddForm && order?.status === "Paid")
            }
          >
            {isCreatePending || isUpdatePending || isRecurringPending ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Memproses...
              </span>
            ) : isAddForm ? (
              bookingType === "recurring" ? (
                (() => {
                  const startDate = watch("startDate");
                  const endDate = watch("endDate");
                  const dayOfWeek = watch("dayOfWeek");
                  
                  if (startDate && endDate && dayOfWeek && selectedSchedule) {
                    const sessions = calculateRecurringSessions(startDate, endDate, dayOfWeek);
                    const totalPrice = sessions.length * selectedSchedule.price;
                    return `Simpan ${sessions.length} Sesi - Rp ${totalPrice.toLocaleString("id-ID")}`;
                  }
                  return "Simpan Pemesanan Berulang";
                })()
              ) : (
                "Simpan Pemesanan"
              )
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

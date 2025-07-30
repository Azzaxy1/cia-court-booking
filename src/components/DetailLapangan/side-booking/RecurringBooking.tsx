"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSchedule } from "@/contexts/ScheduleContext";
import { formatRupiah } from "@/lib/utils";
import { CourtReal } from "@/types/court";
import {
  DAYS_OF_WEEK,
  RecurringBookingFormData,
  RecurringBookingPreview,
} from "@/types/RecurringBooking";
import { recurringBookingSchema } from "@/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaSpinner } from "react-icons/fa";

interface Props {
  court: CourtReal;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: Record<string, unknown>) => void;
          onError: (result: Record<string, unknown>) => void;
        }
      ) => void;
    };
  }
}

const RecurringBooking = ({ court }: Props) => {
  const { selectedSchedule } = useSchedule();
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<RecurringBookingFormData>({
    courtId: court.id,
    dayOfWeek: 5, // Friday by default (now using 1-7 system where 5 = Friday)
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    timeSlot: "",
  });

  const clientKey = process.env.MIDTRANS_CLIENT_KEY as string;

  useEffect(() => {
    // Cek apakah script sudah ada
    if (document.getElementById("midtrans-script")) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.id = "midtrans-script";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("midtrans-script")?.remove();
    };
  }, [clientKey]);

  // Update form data when schedule is selected
  useEffect(() => {
    if (selectedSchedule) {
      const scheduleDate = new Date(selectedSchedule.date);
      const dayOfWeek = scheduleDate.getDay();
      const timeSlot = selectedSchedule.timeSlot;

      // Convert JavaScript getDay() (0-6, Sun-Sat) to our system (1-7, Mon-Sun)
      const ourDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

      setFormData((prev) => ({
        ...prev,
        dayOfWeek: ourDayOfWeek,
        timeSlot,
        startDate: new Date(selectedSchedule.date),
      }));
    }
  }, [selectedSchedule]);

  // Get preview of recurring booking
  const { data: preview, isLoading: isLoadingPreview } =
    useQuery<RecurringBookingPreview>({
      queryKey: ["recurring-booking-preview", formData],
      queryFn: async () => {
        if (!formData.timeSlot || !selectedSchedule) return null;

        const params = new URLSearchParams({
          action: "preview",
          courtId: formData.courtId,
          dayOfWeek: formData.dayOfWeek.toString(),
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          timeSlot: formData.timeSlot,
        });

        const response = await fetch(`/api/recurring-booking?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to get preview");
        }

        return result.data;
      },
      enabled: Boolean(formData.timeSlot && selectedSchedule),
    });

  // Create recurring booking mutation
  const { mutate: createRecurring, isPending: isCreatingBooking } = useMutation(
    {
      mutationFn: async (data: RecurringBookingFormData) => {
        const response = await fetch("/api/recurring-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create recurring booking");
        }

        return result.data;
      },
      onSuccess: (data) => {
        // Proceed to payment with Midtrans
        processPayment(data);
      },
      onError: (error) => {
        toast.error(error.message || "Gagal membuat pemesanan berulang");
      },
    }
  );

  // Payment processing function
  const { mutate: processPayment } = useMutation({
    mutationFn: async (recurringBookingData: {
      recurringBooking: { id: string };
      totalPrice: number;
    }) => {
      const paymentResponse = await fetch("/api/payment/recurring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recurringBookingId: recurringBookingData.recurringBooking.id,
          amount: recurringBookingData.totalPrice,
          customerDetails: {
            first_name: session?.user?.name ?? "User",
            last_name: "",
            email: session?.user?.email ?? "user@email.com",
            phone: session?.user?.phone ?? "",
          },
        }),
      });

      const result = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(result.error || "Failed to process payment");
      }

      return result;
    },
    onSuccess: (paymentData) => {
      const { token } = paymentData;
      console.log("Payment data:", paymentData);

      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: (result) => {
            console.log("Payment success:", result);
            toast.success("Pembayaran berhasil!");
            router.push(`/payment/success?order_id=${result.order_id}`);
          },
          onError: (result) => {
            console.log("Payment error:", result);
            toast.error("Pembayaran gagal!");
          },
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal memproses pembayaran: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchedule) {
      toast.error("Silakan pilih jadwal terlebih dahulu");
      return;
    }

    if (!session?.user) {
      toast.error("Silakan login terlebih dahulu untuk memesan lapangan");
      router.push("/login");
      return;
    }

    try {
      const validatedData = recurringBookingSchema.parse(formData);
      createRecurring(validatedData);
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Data tidak valid. Silakan periksa kembali form Anda.");
    }
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: new Date(value),
    }));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (!selectedSchedule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pemesanan Berulang</CardTitle>
          <CardDescription>
            Pilih jadwal terlebih dahulu untuk mengatur pemesanan berulang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FaCalendarAlt className="mx-auto mb-4" size={48} />
            <p>Silakan pilih jadwal di kalender untuk melanjutkan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Pemesanan Berulang</CardTitle>
          <CardDescription>
            Atur periode dan frekuensi pemesanan berulang Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formatDate(formData.startDate)}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  min={formatDate(new Date())}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Tanggal Berakhir</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formatDate(formData.endDate)}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  min={formatDate(formData.startDate)}
                />
              </div>
            </div>

            <div>
              <Label>Hari dalam Seminggu</Label>
              <div className="mt-2">
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dayOfWeek: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index + 1}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Waktu Bermain</Label>
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedSchedule.timeSlot}</p>
                <p className="text-sm text-gray-600">
                  {formatRupiah(selectedSchedule.price)}/jam
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {isLoadingPreview ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              <span>Memuat preview...</span>
            </div>
          </CardContent>
        </Card>
      ) : preview ? (
        <Card>
          <CardHeader>
            <CardTitle>Preview Pemesanan</CardTitle>
            <CardDescription>Ringkasan pemesanan berulang Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Jumlah Sesi:</span>
                <span className="font-medium">
                  {preview.totalSessions} kali
                </span>
              </div>

              <div className="flex justify-between">
                <span>Harga per Sesi:</span>
                <span>{formatRupiah(selectedSchedule.price)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total Harga:</span>
                <span className="text-teal-600">
                  {formatRupiah(preview.totalPrice)}
                </span>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Jadwal:</strong> Setiap{" "}
                  {DAYS_OF_WEEK[formData.dayOfWeek - 1]} jam{" "}
                  {selectedSchedule.timeSlot}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Periode:</strong>{" "}
                  {formData.startDate.toLocaleDateString("id-ID")} -{" "}
                  {formData.endDate.toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isCreatingBooking}
            >
              {isCreatingBooking ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" size={16} />
                  Memproses...
                </span>
              ) : (
                `Bayar Sekarang - ${formatRupiah(preview.totalPrice)}`
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <Card>
        <CardFooter className="flex-col items-start">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Kebijakan Pembatalan:</span>
            Pembatalan dapat dilakukan hingga 24 jam sebelum jadwal pertama
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Butuh bantuan?</span> Hubungi kami
            di 0851-8219-8144
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecurringBooking;

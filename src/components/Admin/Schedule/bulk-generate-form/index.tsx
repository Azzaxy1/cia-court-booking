"use client";
import { useState } from "react";
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
import { Court } from "@/app/generated/prisma";
import toast from "react-hot-toast";

interface Props {
  courts: Court[];
  onSuccess?: () => void;
}

const TIME_PRESETS = {
  pagi: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  siang: ["14:00", "15:00", "16:00", "17:00", "18:00"],
  malam: ["19:00", "20:00", "21:00", "22:00", "23:00"],
};

export default function BulkGenerateForm({ courts, onSuccess }: Props) {
  const [courtId, setCourtId] = useState("");
  const [days, setDays] = useState(7);
  // const [timeSlots, setTimeSlots] = useState([
  //   "07:00",
  //   "08:00",
  //   "09:00",
  //   "10:00",
  //   "11:00",
  //   "12:00",
  //   "13:00",
  //   "14:00",
  //   "15:00",
  //   "16:00",
  //   "17:00",
  //   "18:00",
  //   "19:00",
  //   "20:00",
  //   "21:00",
  //   "22:00",
  //   "23:00",
  // ]);
  const [price, setPrice] = useState(100000);
  const [dayType, setDayType] = useState<"Weekday" | "Weekend">("Weekday");
  const [loading, setLoading] = useState(false);
  const [timePreset, setTimePreset] = useState<"pagi" | "siang" | "malam">(
    "pagi"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/generate-schedule", {
        method: "POST",
        body: JSON.stringify({
          courtId,
          days,
          timeSlots: TIME_PRESETS[timePreset] || [],
          price,
          dayType,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Jadwal berhasil digenerate!");
        onSuccess?.();
      } else {
        toast.error("Gagal generate jadwal");
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast.error("Terjadi kesalahan saat generate jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    switch (name) {
      case "courtId":
        setCourtId(value);
        break;
      case "dayType":
        setDayType(value as "Weekday" | "Weekend");
        break;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Generate Jadwal Lapangan
        </CardTitle>
        <CardDescription>
          Isi form berikut untuk generate jadwal lapangan secara otomatis
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Court Selection */}
          <div className="space-y-2">
            <Label htmlFor="court">Lapangan</Label>
            <Select
              value={courtId}
              onValueChange={(value) => handleSelectChange("courtId", value)}
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

          {/* Days and Day Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Jumlah Hari</Label>
              <Input
                id="days"
                type="number"
                value={days}
                min={1}
                max={30}
                onChange={(e) => setDays(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayType">Tipe Hari</Label>
              <Select
                value={dayType}
                onValueChange={(value) => handleSelectChange("dayType", value)}
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

          {/* Time Slots */}
          <div className="space-y-2">
            <Label htmlFor="preset">Preset Jam Operasional</Label>
            <Select
              value={timePreset}
              onValueChange={(value) => {
                setTimePreset(value as "pagi" | "siang" | "malam");
                if (value === "pagi") {
                  setPrice(100000); // Set default price for pagi
                } else if (value === "siang") {
                  setPrice(120000); // Set default price for siang
                } else if (value === "malam") {
                  setPrice(150000); // Set default price for malam
                }
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
              Pilih preset untuk mengisi jam otomatis, atau isi manual di bawah.
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Harga per Jam</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Harga yang akan diterapkan: Rp {price.toLocaleString()}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Ringkasan Generate:</h4>
            <div className="text-sm space-y-1">
              <p>
                • Lapangan:{" "}
                {courts.find((c) => c.id === courtId)?.name || "Belum dipilih"}
              </p>
              <p>• Jumlah hari: {days} hari</p>
              <p>• Tipe hari: {dayType}</p>
              <p>• Jumlah slot waktu: {timePreset.length} slot</p>
              <p>• Harga per jam: Rp {price.toLocaleString()}</p>
              <p>
                • Total jadwal yang akan dibuat:{" "}
                <strong>{days * timePreset.length} slot</strong>
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={loading || !courtId}
          >
            {loading ? "Memproses..." : "Generate Jadwal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

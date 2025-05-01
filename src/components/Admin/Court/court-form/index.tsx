"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CourtReal, DayType, TimeSlot } from "@/types/court";
import Image from "next/image";

interface CourtFormProps {
  isAddForm?: boolean;
  court?: CourtReal;
}

const CourtForm = ({ isAddForm, court }: CourtFormProps) => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    surfaceType: "",
    description: "",
    image: "",
    available: true,
    price: {
      Weekday: { Pagi: "", Siang: "", Malam: "" },
      Weekend: { Pagi: "", Siang: "", Malam: "" },
    },
  });

  const fieldTypes = ["Badminton", "Futsal", "Tenis Meja"];
  const surfaceTypes = ["Semen", "Rumput", "Interlok"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handlePriceChange = (day: DayType, time: TimeSlot, value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [day]: {
          ...prev.price[day],
          [time]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulasi POST ke API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Lapangan ditambahkan:", formData);

      toast.success("Lapangan berhasil ditambahkan!");
      router.push("/admin/lapangan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan lapangan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isAddForm ? "Tambah Lapangan Baru" : "Edit Lapangan"}
        </CardTitle>
        <CardDescription>
          {isAddForm ? "Lengkapi" : "Ubah"} detail lapangan di bawah ini.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lapangan</Label>
            <Input
              id="name"
              name="name"
              value={court?.name || formData.name}
              onChange={handleInputChange}
              required
              placeholder="Nama lapangan"
            />
          </div>

          <div className="space-y-2">
            <Label>Jenis Lapangan</Label>
            <Select
              value={court?.type || formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis lapangan" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {"surfaceType" in formData && formData.type === "Futsal" && (
            <div className="space-y-2">
              <Label>Jenis Permukaan</Label>
              <Select
                value={court?.surfaceType || formData.surfaceType}
                disabled={formData.type !== "Futsal"}
                onValueChange={(value) =>
                  setFormData({ ...formData, surfaceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis permukaan" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceTypes.map((surface) => (
                    <SelectItem key={surface} value={surface}>
                      {surface}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">Pilih Gambar</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {formData.image && (
              <Image
                src={court?.image || formData.image}
                alt="Preview Gambar"
                width={100}
                height={100}
                className="w-full max-w-56 mt-4 rounded-lg border"
              />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Weekday", "Weekend"].map((day) =>
              ["Pagi", "Siang", "Malam"].map((time) => (
                <div key={`${day}-${time}`} className="space-y-2">
                  <Label>{`${day} - ${time}`}</Label>
                  <Input
                    type="number"
                    value={
                      court?.price[day as DayType][time as TimeSlot] ||
                      formData.price[day as DayType][time as TimeSlot]
                    }
                    onChange={(e) =>
                      handlePriceChange(
                        day as DayType,
                        time as TimeSlot,
                        e.target.value
                      )
                    }
                    placeholder="Harga dalam rupiah"
                    required
                  />
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Deskripsi lapangan"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Menambahkan..." : "Tambah Lapangan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourtForm;

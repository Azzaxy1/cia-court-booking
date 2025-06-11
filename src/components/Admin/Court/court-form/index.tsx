"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CourtReal } from "@/types/court";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { courtSchema } from "@/validation";
import { createCourt } from "@/services/mainService";

type CourtFormType = z.infer<typeof courtSchema>;

interface CourtFormProps {
  isAddForm?: boolean;
  court?: CourtReal;
}

const fieldTypes = [
  { label: "Badminton", value: "Badminton" },
  { label: "Futsal", value: "Futsal" },
  { label: "Tenis Meja", value: "TenisMeja" },
];
const surfaceTypes = ["Semen", "Rumput", "Interlok"];

const CourtForm = ({ isAddForm, court }: CourtFormProps) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CourtFormType>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
      name: court?.name || "",
      type: court?.type || "",
      surfaceType: court?.surfaceType || "",
      description: court?.description || "",
      image: undefined,
      capacity: court?.capacity || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createCourt,
    onSuccess: (data) => {
      toast.success(data.message || "Lapangan berhasil ditambahkan!");
      router.push("/admin/lapangan");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menambahkan lapangan.");
    },
  });

  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const onSubmit = (data: CourtFormType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.surfaceType) formData.append("surfaceType", data.surfaceType);
    formData.append("description", data.description);
    formData.append("image", data.image);
    formData.append("capacity", data.capacity.toString());
    mutation.mutate(formData);
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lapangan</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nama lapangan"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Jenis Lapangan</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis lapangan" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {watch("type") === "Futsal" && (
            <div className="space-y-2">
              <Label>Jenis Permukaan</Label>
              <Select
                value={watch("surfaceType")}
                onValueChange={(value) => setValue("surfaceType", value)}
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
              {errors.surfaceType && (
                <p className="text-red-500 text-sm">
                  {errors.surfaceType.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">Pilih Gambar</Label>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Gambar lapangan wajib diisi" }}
              render={({ field }) => (
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file) {
                      const objectUrl = URL.createObjectURL(file);
                      setPreview(objectUrl);
                    }
                  }}
                />
              )}
            />
            {preview && (
              <Image
                src={preview}
                alt="Preview Gambar"
                width={100}
                height={100}
                className="w-full max-w-56 mt-4 rounded-lg border"
              />
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">
                {errors.image.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Deskripsi lapangan"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Kapasitas Lapangan</Label>
            <Input
              id="capacity"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="Kapasitas lapangan (misal: 10)"
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin mr-2" size={16} /> Sedang
                memproses...
              </span>
            ) : (
              "Simpan Lapangan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourtForm;

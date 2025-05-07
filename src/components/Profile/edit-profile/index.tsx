"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/services/authService";
import { IUser } from "@/types/User";
import { profileSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  user: IUser | null;
}

const EditProfileForm = ({ user }: Props) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        window.location.reload();
        toast.success("Profil berhasil diperbarui");
      } else {
        toast.error(data.message || "Gagal memperbarui profil");
      }
    },
    onError: () => {
      toast.error("Terjadi kesalahan, silakan coba lagi.");
    },
  });

  const onSubmit = (formData: Record<string, string>) => {
    mutate(formData);
    toast.success("Perubahan berhasil disimpan");
  };

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nama Lengkap</Label>
            <Input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              className="w-full p-2 border rounded-md"
              {...register("email")}
              disabled
            />
          </div>
          {user?.phone && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nomor Telepon</Label>
              <Input
                type="tel"
                className="w-full p-2 border rounded-md"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          )}
        </div>
        <div className="pt-4">
          <Button disabled={isSubmitting || isPending} type="submit">
            {isSubmitting || isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </CardContent>
  );
};

export default EditProfileForm;

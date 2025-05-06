"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";

const EditProfileForm = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Perubahan berhasil disimpan");
  };

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nama Lengkap</Label>
            <Input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue={user?.name || ""}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              className="w-full p-2 border rounded-md"
              defaultValue={user?.email || ""}
            />
          </div>
          {user?.phone && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nomor Telepon</Label>
              <Input
                type="tel"
                className="w-full p-2 border rounded-md"
                defaultValue={user?.phone || ""}
              />
            </div>
          )}
        </div>
        <div className="pt-4">
          <Button>Simpan Perubahan</Button>
        </div>
      </form>
    </CardContent>
  );
};

export default EditProfileForm;

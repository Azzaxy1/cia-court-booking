"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";

const SideProfile = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Berhasil keluar");
    } catch (error) {
      toast.error(`Gagal keluar, silakan coba lagi. ${error}`);
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">Profil Saya</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src={session?.user.image || ""}
              alt={session?.user.name || "Avatar"}
            />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
              {(session?.user?.name || "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-1">{session?.user.name}</h2>
          <p className="text-gray-500 mb-4">{session?.user.email}</p>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Keluar
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-teal-700 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-medium">{session?.user.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MdEmail className="h-5 w-5 text-teal-700 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session?.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideProfile;

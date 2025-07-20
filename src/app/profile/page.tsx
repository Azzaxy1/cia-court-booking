import React from "react";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { History } from "lucide-react";
import SideProfile from "@/components/Profile/side-profile";
import BookingHistoryList from "@/components/Profile/booking-history-list";
import EditProfileForm from "@/components/Profile/edit-profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return (
      <div className="container mx-auto md:px-12 pt-28 pb-10">
        <h2 className="text-2xl font-bold">Anda belum login</h2>
        <p className="text-gray-500">
          Silakan login untuk mengakses halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:px-12 pt-28 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SideProfile />

        {/* Konten Utama */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="bookings">Riwayat Pembayaran</TabsTrigger>
              <TabsTrigger value="profile">Edit Profil</TabsTrigger>
            </TabsList>

            {/* Tab Pembayaran */}
            <TabsContent value="bookings">
              <BookingHistoryList />
            </TabsContent>

            {/* Tab Profile */}
            <TabsContent value="profile">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Akun</CardTitle>
                    <CardDescription>
                      Perbarui informasi profil dan keamanan akun Anda
                    </CardDescription>
                  </CardHeader>

                  {/* Edit Profile Form */}
                  <EditProfileForm user={session.user} />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

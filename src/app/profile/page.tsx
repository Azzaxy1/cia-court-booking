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
import BookingHistory from "@/components/Profile/booking-history";
import EditProfileForm from "@/components/Profile/edit-profile";
import { getBookingHistory } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BsFillCartXFill } from "react-icons/bs";

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

  const bookingHistories = await getBookingHistory(session.user.id);

  return (
    <div className="container mx-auto md:px-12 pt-28 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SideProfile />

        {/* Konten Utama */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="bookings">Pemesanan</TabsTrigger>
              <TabsTrigger value="profile">Edit Profil</TabsTrigger>
            </TabsList>

            {/* Tab Pemesanan */}
            <TabsContent value="bookings">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Riwayat Pemesanan</h2>
                {/* <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" /> Lihat Semua
                </Button> */}
              </div>

              <div className="space-y-4">
                {bookingHistories.length > 0 ? (
                  bookingHistories.map((booking) => (
                    <BookingHistory key={booking.id} booking={booking} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-36">
                    <BsFillCartXFill className="h-20 w-20 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      Tidak ada pemesanan yang ditemukan
                    </p>
                  </div>
                )}
              </div>
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
                  <EditProfileForm />
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

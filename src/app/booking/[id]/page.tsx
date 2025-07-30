import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import BookingDetail from "@/components/BookingDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const BookingDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: id,
      userId: session.user.id, // Pastikan hanya user yang memiliki booking ini yang bisa akses
    },
    include: {
      court: {
        include: {
          Schedule: true,
        },
      },
      Transaction: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="container mx-auto md:px-12 pt-28 pb-10">
      <BookingDetail booking={booking} />
    </div>
  );
};

export default BookingDetailPage;

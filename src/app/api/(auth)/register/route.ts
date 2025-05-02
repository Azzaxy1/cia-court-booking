import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Gagal mendaftar" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Berhasil mendaftar",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mendaftar", error },
      { status: 500 }
    );
  }
}

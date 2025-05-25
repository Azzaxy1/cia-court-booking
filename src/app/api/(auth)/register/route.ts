import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
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
        success: true,
        message: "Berhasil mendaftar",
        data: user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "400") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mendaftar",
        error: error instanceof Error ? error.message : "Failed to register",
      },
      { status: 500 }
    );
  }
}

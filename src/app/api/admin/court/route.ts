import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { FutsalSurface, CourtType } from "@/app/generated/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const surfaceType = formData.get("surfaceType") as string;
    const description = formData.get("description") as string;
    const capacity = Number(formData.get("capacity"));
    const file = formData.get("image") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const imageUrl = `/uploads/court/${filename}`;
    const filepath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "court",
      filename
    );
    await writeFile(filepath, buffer);

    await prisma.court.create({
      data: {
        name,
        type: type as CourtType,
        surfaceType: surfaceType as FutsalSurface,
        description,
        capacity,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      { success: true, message: "Lapangan berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "400") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan lapangan",
        error: error instanceof Error ? error.message : "Failed to register",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const surfaceType = formData.get("surfaceType") as string;
    const description = formData.get("description") as string;
    const capacity = Number(formData.get("capacity"));
    const file = formData.get("image");

    let imageUrl: string | undefined;

    if (file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const filepath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "court",
        filename
      );
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/court/${filename}`;
    } else if (typeof file === "string" && file.startsWith("/uploads/court/")) {
      imageUrl = file;
    }

    await prisma.court.update({
      where: { id },
      data: {
        name,
        type: type as CourtType,
        surfaceType: surfaceType as FutsalSurface,
        description,
        capacity,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      { success: true, message: "Lapangan berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "400") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui lapangan",
        error: error instanceof Error ? error.message : "Failed to update",
      },
      { status: 500 }
    );
  }
}

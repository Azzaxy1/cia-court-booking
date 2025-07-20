import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBookingHistory } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "3");

    const result = await getBookingHistory(session.user.id, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking history" },
      { status: 500 }
    );
  }
}

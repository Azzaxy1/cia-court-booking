import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const protection = await prisma.systemProtection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!protection) {
      return NextResponse.json({ isExpired: false });
    }

    const now = new Date();
    const expiredAt = new Date(protection.expiredAt);
    const isExpired = now > expiredAt;

    return NextResponse.json({ 
      isExpired,
      expiredAt: protection.expiredAt,
      migratedAt: protection.migratedAt,
      protectionDays: protection.protectionDays
    });
  } catch (error) {
    console.error('System protection check failed:', error);
    // Untuk keamanan, return expired jika ada error
    return NextResponse.json({ isExpired: true });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { SystemProtectionService } from '@/services/systemProtectionService';

// GET - Cek status sistem proteksi
export async function GET() {
  try {
    const protectionDetails = await SystemProtectionService.getProtectionDetails();
    
    if (!protectionDetails) {
      return NextResponse.json({
        message: 'No system protection found',
        isProtected: false,
        isExpired: false
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'System protection status retrieved successfully',
      ...protectionDetails
    });
  } catch (error) {
    console.error('Failed to get system protection status:', error);
    return NextResponse.json({
      message: 'Failed to get system protection status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Inisialisasi atau update sistem proteksi (hanya untuk development/admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, protectionDays, protectionMinutes } = body;

    switch (action) {
      case 'initialize':
        if (protectionMinutes) {
          // Inisialisasi dengan menit untuk testing
          await SystemProtectionService.initializeMinutes(protectionMinutes);
          return NextResponse.json({
            message: `System protection initialized for ${protectionMinutes} minutes`
          });
        } else {
          // Inisialisasi dengan hari untuk production
          await SystemProtectionService.initializeProtection(protectionDays || 30);
          return NextResponse.json({
            message: `System protection initialized for ${protectionDays || 30} days`
          });
        }

      case 'update':
        if (protectionMinutes) {
          // Update dengan menit untuk testing
          await SystemProtectionService.updateProtectionMinutes(protectionMinutes);
          return NextResponse.json({
            message: `System protection updated to ${protectionMinutes} minutes`
          });
        } else if (protectionDays && protectionDays >= 1) {
          // Update dengan hari untuk production
          await SystemProtectionService.updateProtectionDays(protectionDays);
          return NextResponse.json({
            message: `System protection updated to ${protectionDays} days`
          });
        } else {
          return NextResponse.json({
            message: 'Protection days must be at least 1 or provide protectionMinutes for testing'
          }, { status: 400 });
        }

      case 'disable':
        await SystemProtectionService.disableProtection();
        return NextResponse.json({
          message: 'System protection disabled'
        });

      case 'enable':
        if (protectionMinutes) {
          await SystemProtectionService.enableProtection(protectionMinutes);
          return NextResponse.json({
            message: `System protection enabled for ${protectionMinutes} minutes`
          });
        } else {
          return NextResponse.json({
            message: 'protectionMinutes required for enable action'
          }, { status: 400 });
        }

      case 'deactivate':
        await SystemProtectionService.deactivateProtection();
        return NextResponse.json({
          message: 'System protection deactivated'
        });

      default:
        return NextResponse.json({
          message: 'Invalid action. Use: initialize, update, or deactivate'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to manage system protection:', error);
    return NextResponse.json({
      message: 'Failed to manage system protection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

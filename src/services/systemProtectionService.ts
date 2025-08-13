import { prisma } from '@/lib/prisma';

export class SystemProtectionService {
  
  /**
   * Inisialisasi sistem proteksi saat migration pertama kali
   * @param protectionDays Jumlah hari proteksi (default: 30)
   */
  static async initializeProtection(protectionDays: number = 30): Promise<void> {
    try {
      // Cek apakah sudah ada record system protection
      const existingProtection = await prisma.systemProtection.findFirst();
      
      if (!existingProtection) {
        const now = new Date();
        const expiredAt = new Date(now);
        expiredAt.setDate(now.getDate() + protectionDays);

        await prisma.systemProtection.create({
          data: {
            isActive: true,
            protectionDays,
            migratedAt: now,
            expiredAt,
            description: `System protection for ${protectionDays} days trial period`
          }
        });
        
        console.log(`✅ System protection initialized for ${protectionDays} days`);
      } else {
        console.log(`⚠️ System protection already exists`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize system protection:', error);
      throw error;
    }
  }

  /**
   * Cek apakah sistem masih dalam periode proteksi
   */
  static async checkProtectionStatus(): Promise<{
    isProtected: boolean;
    isExpired: boolean;
    daysRemaining: number;
    expiredAt: Date | null;
    protectionData: unknown | null;
  }> {
    try {
      const protection = await prisma.systemProtection.findFirst({
        where: { isActive: true }
      });

      if (!protection) {
        return {
          isProtected: false,
          isExpired: false,
          daysRemaining: 0,
          expiredAt: null,
          protectionData: null
        };
      }

      const now = new Date();
      const isExpired = now > protection.expiredAt;
      const daysRemaining = isExpired ? 0 : Math.ceil((protection.expiredAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isProtected: protection.isActive,
        isExpired,
        daysRemaining,
        expiredAt: protection.expiredAt,
        protectionData: protection
      };
    } catch (error) {
      console.error('❌ Failed to check protection status:', error);
      // Jika terjadi error, anggap sistem terproteksi untuk keamanan
      return {
        isProtected: true,
        isExpired: true,
        daysRemaining: 0,
        expiredAt: null,
        protectionData: null
      };
    }
  }

  /**
   * Update waktu proteksi
   * @param protectionDays Jumlah hari baru
   */
  static async updateProtectionDays(protectionDays: number): Promise<void> {
    try {
      const protection = await prisma.systemProtection.findFirst({
        where: { isActive: true }
      });

      if (protection) {
        const newExpiredAt = new Date(protection.migratedAt);
        newExpiredAt.setDate(protection.migratedAt.getDate() + protectionDays);

        await prisma.systemProtection.update({
          where: { id: protection.id },
          data: {
            protectionDays,
            expiredAt: newExpiredAt,
            updatedAt: new Date()
          }
        });

        console.log(`✅ Protection days updated to ${protectionDays} days`);
      }
    } catch (error) {
      console.error('❌ Failed to update protection days:', error);
      throw error;
    }
  }

  /**
   * Deaktivasi sistem proteksi (hanya untuk development/testing)
   */
  static async deactivateProtection(): Promise<void> {
    try {
      await prisma.systemProtection.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      console.log('✅ System protection deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate protection:', error);
      throw error;
    }
  }

  /**
   * Get detail proteksi untuk admin dashboard
   */
  static async getProtectionDetails() {
    try {
      const protection = await prisma.systemProtection.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (!protection) {
        return null;
      }

      const status = await this.checkProtectionStatus();

      return {
        ...protection,
        status
      };
    } catch (error) {
      console.error('❌ Failed to get protection details:', error);
      return null;
    }
  }

  /**
   * Initialize protection dengan menit (untuk testing)
   */
  static async initializeMinutes(minutes: number): Promise<void> {
    try {
      await prisma.systemProtection.deleteMany({});
      
      const now = new Date();
      const expiredAt = new Date(now.getTime() + (minutes * 60 * 1000));

      await prisma.systemProtection.create({
        data: {
          isActive: true,
          protectionDays: 1, // Set ke 1 hari tapi expired sesuai menit
          migratedAt: now,
          expiredAt,
          description: `System protection for ${minutes} minutes trial period`
        }
      });
      
      console.log(`✅ System protection initialized for ${minutes} minutes`);
    } catch (error) {
      console.error('❌ Failed to initialize system protection:', error);
      throw error;
    }
  }

  /**
   * Update protection duration dalam menit
   */
  static async updateProtectionMinutes(minutes: number): Promise<void> {
    try {
      const protection = await prisma.systemProtection.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (protection) {
        const now = new Date();
        const expiredAt = new Date(now.getTime() + (minutes * 60 * 1000));

        await prisma.systemProtection.update({
          where: { id: protection.id },
          data: {
            expiredAt,
            description: `System protection for ${minutes} minutes trial period`
          }
        });
        
        console.log(`✅ System protection updated to ${minutes} minutes`);
      }
    } catch (error) {
      console.error('❌ Failed to update system protection:', error);
      throw error;
    }
  }

  /**
   * Disable protection (set isActive = false)
   */
  static async disableProtection(): Promise<void> {
    try {
      await prisma.systemProtection.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
      
      console.log(`✅ System protection disabled`);
    } catch (error) {
      console.error('❌ Failed to disable system protection:', error);
      throw error;
    }
  }

  /**
   * Enable protection dengan menit baru
   */
  static async enableProtection(minutes: number): Promise<void> {
    try {
      const protection = await prisma.systemProtection.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (protection) {
        const now = new Date();
        const expiredAt = new Date(now.getTime() + (minutes * 60 * 1000));

        await prisma.systemProtection.update({
          where: { id: protection.id },
          data: {
            isActive: true,
            expiredAt,
            description: `System protection for ${minutes} minutes trial period`
          }
        });
      }
      
      console.log(`✅ System protection enabled for ${minutes} minutes`);
    } catch (error) {
      console.error('❌ Failed to enable system protection:', error);
      throw error;
    }
  }
}

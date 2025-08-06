# 🏐 Sistem Reservasi Lapangan CIA Serang

Selamat datang di **Sistem Reservasi Lapangan CIA Serang** — sebuah platform berbasis web yang dirancang untuk mendigitalisasi proses pemesanan lapangan olahraga (futsal, badminton, dan tenis meja) di CIA Serang. Sistem ini menyediakan fitur pemesanan real-time, pembayaran online yang aman, dan pengalaman pengguna yang praktis dengan dukungan pemesanan berulang.

---

## 🌟 Fitur Utama

### 1. **Fitur untuk Pengguna (Customer)**

- **🏟️ Reservasi Lapangan Online**: Pesan lapangan futsal, badminton, atau tenis meja langsung melalui website dengan antarmuka yang intuitif.
- **📅 Ketersediaan Real-time**: Cek ketersediaan jadwal lapangan secara langsung berdasarkan tanggal dan waktu yang dipilih.
- **🔄 Pemesanan Berulang (Recurring Booking)**: Fitur booking otomatis untuk jadwal tetap mingguan, cocok untuk klub atau latihan rutin.
- **✏️ Reschedule & Cancel Booking**: Mengubah jadwal atau membatalkan pemesanan dengan notifikasi otomatis.
- **💳 Payment Gateway Terintegrasi**: Pembayaran online yang aman melalui Midtrans dengan berbagai metode pembayaran.
- **📧 Notifikasi Email**: Konfirmasi booking dan bukti pembayaran dikirim otomatis melalui email.
- **👤 Profil Pengguna**: Kelola informasi pribadi dan riwayat pemesanan.
- **🔐 Autentikasi Multi-Provider**: Login menggunakan kredensial atau Google OAuth.

### 2. **Fitur untuk Admin (Owner & Cashier)**

- **📊 Dashboard Analitik**: Pantau statistik pemesanan, pendapatan, dan performa lapangan dengan grafik interaktif.
- **🏟️ Manajemen Lapangan**: Tambah, edit, atau hapus data lapangan dengan upload gambar.
- **📅 Kelola Jadwal**: Atur jadwal operasional dan harga per slot waktu untuk setiap lapangan.
- **📋 Manajemen Pemesanan**:
  - Pemesanan reguler (sekali booking)
  - Pemesanan berulang (recurring booking)
  - Edit, konfirmasi, dan batalkan pesanan
- **💰 Laporan Pemasukan**: Analisis pendapatan dengan filter berdasarkan periode dan jenis lapangan.
- **🛡️ Role-based Access Control**: Kontrol akses berdasarkan peran (Owner/Cashier).
- **📱 Responsive Interface**: Antarmuka admin yang responsif dan user-friendly.

---

## 🛠️ Tech Stack

### **Frontend & Framework**

- **Next.js 15.1.7**: Framework React modern dengan App Router untuk SSR, SSG, dan optimasi performa
- **TypeScript 5.8.3**: Type safety dan developer experience yang lebih baik
- **React 18**: Library UI dengan hooks dan concurrent features

### **UI & Styling**

- **TailwindCSS 3.4.1**: Utility-first CSS framework untuk styling yang konsisten
- **Shadcn/ui**: Komponen UI yang customizable berbasis Radix UI
- **Lucide React**: Koleksi ikon modern dan konsisten
- **React Icons**: Ikon tambahan untuk kebutuhan UI yang beragam
- **Next Themes**: Dark/light mode support

### **State Management & Data Fetching**

- **TanStack Query (React Query) 5.66.9**: Server state management dan caching
- **React Hook Form 7.54.2**: Form management dengan validasi
- **Zod 3.24.2**: Schema validation untuk type-safe form handling
- **Axios 1.8.1**: HTTP client untuk API requests

### **Database & Backend**

- **PostgreSQL**: Database relasional untuk data persistence
- **Prisma 6.7.0**: Modern ORM dengan type safety dan database migrations
- **NextAuth.js 4.24.11**: Authentication dengan multi-provider support
  - Google OAuth
  - Credentials (email/password)
  - Session management dengan JWT

### **Payment & Email**

- **Midtrans Client 1.4.2**: Payment gateway Indonesia untuk transaksi online
- **Nodemailer 7.0.5**: Service untuk mengirim email notifikasi dan konfirmasi

### **Development Tools**

- **Bun**: Package manager dan runtime JavaScript yang cepat
- **ESLint**: Code linting untuk kualitas kode
- **TypeScript Compiler**: Type checking dan transpilation

### **Additional Libraries**

- **bcryptjs**: Password hashing untuk keamanan
- **date-fns**: Utilitas manipulasi tanggal
- **jsPDF & jsPDF-AutoTable**: Generate PDF reports
- **AOS (Animate On Scroll)**: Animasi scroll untuk UI yang menarik
- **React Hot Toast**: Toast notifications
- **Recharts**: Library untuk visualisasi data dan grafik
- **Lodash**: Utility functions untuk JavaScript

### **Deployment & Infrastructure**

- **Docker**: Containerization untuk deployment consistency
- **Docker Compose**: Multi-container application orchestration

---

## 🏗️ Arsitektur Sistem

### **Database Schema**

Sistem ini menggunakan 8 model utama:

- **User**: Data pengguna dengan role-based access (Customer, Owner, Cashier)
- **Account & Session**: NextAuth.js authentication management
- **Court**: Data lapangan olahraga (futsal, badminton, tenis meja)
- **Schedule**: Jadwal operasional dan pricing per lapangan
- **Booking**: Pemesanan reguler (sekali booking)
- **RecurringBooking**: Pemesanan berulang dengan pola mingguan
- **Transaction**: Data transaksi dan status pembayaran

### **API Routes**

- `/api/auth/[...nextauth]`: Authentication endpoints
- `/api/courts`: CRUD operations untuk lapangan
- `/api/schedules`: Manajemen jadwal dan ketersediaan
- `/api/bookings`: Pemesanan reguler
- `/api/recurring-bookings`: Pemesanan berulang
- `/api/transactions`: Payment processing dengan Midtrans
- `/api/admin/*`: Admin-specific endpoints

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ atau Bun runtime
- PostgreSQL database
- Akun Midtrans untuk payment gateway
- Gmail SMTP untuk email notifications (opsional)

### **Installation**

1. **Clone repository**

   ```bash
   git clone https://github.com/Azzaxy1/cia-court.git
   cd cia-court
   ```

2. **Install dependencies**

   ```bash
   bun install
   # atau
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env` dan konfigurasi:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/cia_court"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (opsional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Midtrans Payment Gateway
   MIDTRANS_SERVER_KEY="your-midtrans-server-key"
   MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
   MIDTRANS_IS_PRODUCTION="false"

   # Email SMTP (opsional)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USERNAME="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   bun prisma generate

   # Run migrations
   bun prisma migrate dev

   # Seed data (opsional)
   bun run seed
   ```

5. **Start development server**

   ```bash
   bun dev
   ```

6. **Access aplikasi**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

### **Production Deployment**

1. **Using Docker**

   ```bash
   # Build dan jalankan dengan docker-compose
   docker-compose up -d
   ```

2. **Manual Build**
   ```bash
   bun run build
   bun start
   ```

---

## � Screenshots & Demo

### **Landing Page**

- Hero section dengan informasi umum CIA Serang
- Panduan cara memesan lapangan
- FAQ section
- Tentang kami

### **Sistem Pemesanan**

- Pilih jenis lapangan (Futsal, Badminton, Tenis Meja)
- Pilih tanggal dan slot waktu yang tersedia
- Detail lapangan dengan gambar dan fasilitas
- Form pemesanan dengan validasi

### **Admin Dashboard**

- Statistik real-time pemesanan dan pendapatan
- Grafik analitik dengan Recharts
- Manajemen lapangan, jadwal, dan pemesanan
- Laporan PDF untuk pemasukan

---

## 🧪 Testing

```bash
# Run linting
bun run lint

# Type checking
bun run type-check

# Build test
bun run build
```

---

## 🔧 Konfigurasi Tambahan

### **Midtrans Setup**

1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Ambil Server Key dan Client Key
3. Konfigurasi webhook URL: `your-domain.com/api/payments/callback`

### **Google OAuth Setup**

1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Konfigurasi OAuth consent screen
4. Tambahkan authorized redirect URIs

### **Email Configuration**

1. Enable 2-factor authentication di Gmail
2. Generate App Password
3. Gunakan App Password sebagai SMTP_PASSWORD

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## �📚 ERD & Diagram

- **ERD**: Dibuat menggunakan Whimsical untuk visualisasi relasi database
- **Arsitektur Sistem**: Digambar dengan Draw.io untuk dokumentasi teknis
- **User Flow**: Dokumentasi alur pengguna dari booking hingga pembayaran

---

## 📩 Kontak

Untuk pertanyaan, bug reports, atau kolaborasi:

- **Developer**: Abdurrohman Azis
- **Email**: [abdurrohmanazis@gmail.com](mailto:abdurrohmanazis@gmail.com)
- **GitHub**: [Azzaxy1](https://github.com/Azzaxy1)
- **LinkedIn**: [Abdurrohman Azis](https://linkedin.com/in/abdurrohman-azis)

**Proyek Skripsi** - Sistem Informasi, Universitas Sultan Ageng Tirtayasa

---

## ⭐ Acknowledgments

Terima kasih kepada:

- **Dosen Pembimbing** yang telah memberikan guidance selama pengembangan
- **CIA Serang** sebagai mitra dalam digitalisasi sistem reservasi
- **Open Source Community** atas tools dan libraries yang luar biasa
- **Rekan-rekan tim** yang memberikan feedback dan dukungan

---

## � License

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail lengkap.

```
MIT License

Copyright (c) 2025 Abdurrohman Azis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🚀 Status Proyek

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black)

**Status**: ✅ **Production Ready**  
**Last Updated**: August 2025

---

_Terima kasih telah menggunakan Sistem Reservasi Lapangan CIA Serang! Jangan lupa untuk memberikan ⭐ star jika project ini membantu Anda._


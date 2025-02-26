# 🏐 Sistem Reservasi Lapangan CIA

Selamat datang di **Sistem Reservasi Lapangan CIA** — sebuah platform berbasis web yang dirancang untuk mendigitalisasi proses pemesanan lapangan olahraga (futsal, badminton, dan tenis meja) di CIA Serang. Sistem ini menyediakan fitur pemesanan real-time, pembayaran online yang aman, dan pengalaman pengguna yang praktis.

---

## 🌟 Fitur

### 1. **Fitur untuk Pengguna**

- **Reservasi Lapangan Online**: Pesan lapangan futsal, badminton, atau tenis meja langsung melalui website.
- **Ketersediaan Real-time**: Cek ketersediaan lapangan secara langsung sesuai tanggal dan waktu yang diinginkan.
- **Reschedule & Cancel Booking**: Mengubah jadwal atau membatalkan pemesanan dengan pembaruan otomatis.
- **Integrasi Payment Gateway**: Pembayaran online yang aman melalui Midtrans.
- **Konfirmasi & Bukti Pembayaran**: Notifikasi email untuk konfirmasi transaksi yang berhasil.

### 2. **Fitur untuk Admin**

- **Dashboard**: Pantau statistik pemesanan dan pendapatan.
- **Kelola Jadwal Lapangan**: Tambah, perbarui, atau hapus jadwal lapangan.
- **Manajemen Transaksi**: Melihat dan mengonfirmasi pembayaran serta pembatalan.

---

## 🛠️ Tech Stack

### **Bahasa Pemrograman & Framework**

- **TypeScript**: Menjamin keamanan tipe data dan meningkatkan pengalaman pengembangan.
- **Next.js**: Framework React untuk server-side rendering (SSR) dan static site generation (SSG).

### **Styling**

- **TailwindCSS**: Framework CSS utility-first untuk pengembangan UI yang cepat.
- **Shadcn/ui**: Komponen UI yang indah dan mudah disesuaikan.

### **Pengambilan Data**

- **Tanstack Query (React Query)**: Mengelola state server secara efisien.
- **Axios**: HTTP client berbasis Promise untuk permintaan API.

### **Database & ORM**

- **PostgreSQL**: Database relasional untuk menyimpan data terstruktur.
- **Prisma**: ORM modern untuk berinteraksi dengan database.

### **Ikon & Grafik**

- **Lucide React**: Koleksi ikon luas untuk elemen UI.

### **Diagram & ERD**

- **Whimsical** & **Draw.io**: Digunakan untuk membuat Entity Relationship Diagrams (ERD) dan arsitektur sistem.

---

## 🚀 Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal:

1. **Klon repositori**
   ```bash
   git clone https://github.com/yourusername/cia-court-booking.git
   ```
2. **Masuk ke direktori proyek**
   ```bash
   cd cia-court-booking
   ```
3. **Instal dependensi menggunakan Bun**
   ```bash
   bun install
   ```
4. **Atur variabel lingkungan**
   Buat file `.env` di root dan tambahkan:
   ```plaintext
   DATABASE_URL=your_postgresql_connection_string
   NEXT_PUBLIC_PAYMENT_GATEWAY_KEY=your_midtrans_key
   ```
5. **Migrasi database menggunakan Prisma**
   ```bash
   bun prisma migrate dev
   ```
6. **Jalankan server pengembangan**
   ```bash
   bun dev
   ```

Akses aplikasi di [http://localhost:3000](http://localhost:3000)

---

## 📚 ERD & Diagram

- **ERD**: Dibuat menggunakan Whimsical
- **Arsitektur Sistem**: Digambar dengan Draw.io

---

## 📩 Kontak

Untuk pertanyaan atau kolaborasi, silakan hubungi:

- **Nama**: Abdurrohman Azis
- **Email**: [abdurrohmanazis@gmail.com](mailto:abdurrohmanazis@gmail.com)
- **GitHub**: [Azzaxy1](https://github.com/Azzaxy1)

---

## ⭐ Penghargaan

Terima kasih kepada dosen pembimbing dan rekan-rekan tim yang telah memberikan dukungan luar biasa selama pengembangan proyek ini.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

Jangan ragu untuk melakukan fork dan berkontribusi! 💛


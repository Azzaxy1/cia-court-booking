import { z } from "zod";

const authSchema = z
  .object({
    name: z.string().min(3, "Nama harus lebih dari 3 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(10, "No telepon tidak valid"),
    password: z.string().min(5, "Password minimal 8 karakter"),
    role: z.enum(["CUSTOMER", "CASHIER", "OWNER"], {
      errorMap: () => ({ message: "Role tidak valid" }),
    }),
  })
  .partial({
    name: true,
    phone: true,
    role: true,
  });

const profileSchema = z.object({
  name: z.string().min(3, "Nama harus lebih dari 3 karakter"),
  phone: z.string().min(10, "No telepon tidak valid"),
  email: z.string().email("Email tidak valid"),
});

const courtSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  type: z.string().min(1, "Jenis wajib diisi"),
  surfaceType: z.string().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.union([
    z
      .instanceof(File)
      .refine((file) => file && file.size > 0, "Gambar wajib diisi"),
    z.string().url().optional(),
  ]),
  capacity: z.number().min(1, "Kapasitas wajib diisi"),
});

const scheduleSchema = z.object({
  courtId: z.string().min(1, "ID lapangan wajib diisi"),
  days: z
    .number()
    .min(1, "Jumlah hari harus lebih dari 0")
    .max(30, "Maksimal 30 hari"),
  dayType: z.enum(["Weekday", "Weekend"], {
    errorMap: () => ({ message: "Tipe hari tidak valid" }),
  }),
  timePreset: z.enum(["pagi", "siang", "malam"], {
    errorMap: () => ({ message: "Preset waktu tidak valid" }),
  }),
  price: z.number().min(0, "Harga harus lebih dari atau sama dengan 0"),
  available: z.boolean().optional(),
});

const orderSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  courtId: z.string().min(1, "ID lapangan wajib diisi"),
  selectedDate: z.date().optional(),
  selectedSchedule: z
    .object({
      id: z.string(),
      timeSlot: z.string(),
      price: z.number(),
      available: z.boolean(),
    })
    .nullable(),
  date: z.date().optional(),
  scheduleId: z.string().optional(),
  timeSlot: z.string().optional(),
  status: z.enum(["Paid", "Pending", "Canceled", "Refunded"], {
    errorMap: () => ({ message: "Status tidak valid" }),
  }),
  paymentMethod: z
    .enum(["Cash", "bank_transfer", "credit_card"], {
      errorMap: () => ({ message: "Metode pembayaran tidak valid" }),
    })
    .optional(),
});

export { authSchema, profileSchema, courtSchema, scheduleSchema, orderSchema };

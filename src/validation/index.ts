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

const recurringBookingSchema = z
  .object({
    courtId: z.string().min(1, "Lapangan harus dipilih"),
    timeSlot: z.string().min(1, "Waktu harus dipilih"),
    dayOfWeek: z.number().min(1).max(7, "Hari tidak valid"),
    startDate: z.date({
      required_error: "Tanggal mulai harus dipilih",
    }),
    endDate: z.date({
      required_error: "Tanggal selesai harus dipilih",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
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
    .max(30, "Maksimal 30 hari")
    .optional(),
  dayType: z.enum(["Weekday", "Weekend"], {
    errorMap: () => ({ message: "Tipe hari tidak valid" }),
  }),
  timePreset: z
    .enum(["pagi", "siang", "malam"], {
      errorMap: () => ({ message: "Preset waktu tidak valid" }),
    })
    .optional(),
  price: z.number().min(0, "Harga harus lebih dari atau sama dengan 0"),
  available: z.boolean().optional(),
  // Fields for edit mode
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

const orderSchema = z
  .object({
    customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
    courtId: z.string().min(1, "ID lapangan wajib diisi"),
    bookingType: z.enum(["single", "recurring"], {
      errorMap: () => ({ message: "Tipe pemesanan tidak valid" }),
    }),
    // Fields for single booking
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
    // Fields for recurring booking
    dayOfWeek: z.number().min(1).max(7).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    recurringTimeSlot: z.string().optional(),
    // Common fields
    status: z.enum(["Paid", "Pending", "Canceled", "Refunded"], {
      errorMap: () => ({ message: "Status tidak valid" }),
    }),
    paymentMethod: z
      .enum(["Cash", "bank_transfer", "credit_card"], {
        errorMap: () => ({ message: "Metode pembayaran tidak valid" }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.bookingType === "single") {
      if (!data.selectedDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal harus dipilih untuk pemesanan sekali",
          path: ["selectedDate"],
        });
      }
      if (!data.selectedSchedule) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jadwal harus dipilih untuk pemesanan sekali",
          path: ["selectedSchedule"],
        });
      }
    } else if (data.bookingType === "recurring") {
      if (!data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal mulai harus dipilih untuk pemesanan berulang",
          path: ["startDate"],
        });
      }
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal selesai harus dipilih untuk pemesanan berulang",
          path: ["endDate"],
        });
      }
      if (!data.dayOfWeek) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hari harus dipilih untuk pemesanan berulang",
          path: ["dayOfWeek"],
        });
      }
      if (!data.recurringTimeSlot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Waktu harus dipilih untuk pemesanan berulang",
          path: ["recurringTimeSlot"],
        });
      }
      if (data.endDate && data.startDate && data.endDate <= data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal selesai harus setelah tanggal mulai",
          path: ["endDate"],
        });
      }
    }
  });

export {
  authSchema,
  profileSchema,
  courtSchema,
  scheduleSchema,
  orderSchema,
  recurringBookingSchema,
};

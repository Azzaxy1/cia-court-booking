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

export { authSchema, profileSchema, courtSchema };

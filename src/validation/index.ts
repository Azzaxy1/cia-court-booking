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

export { authSchema };

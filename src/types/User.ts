// type Role = "CUSTOMER" | "CASHIER" | "OWNER";

export interface IUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  phone?: string | null;
}

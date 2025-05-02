type Role = "CUSTOMER" | "CASHIER" | "OWNER";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  image?: string | null;
  password: string;
  role?: Role;
}

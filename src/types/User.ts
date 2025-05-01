type Role = "customer" | "cashier" | "owner";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  image: string | null;
  role?: Role;
}

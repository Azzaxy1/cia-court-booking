export interface IUser {
  name: string;
  email: string;
  phone: string;
  role?: "user" | "admin";
  image: string | null;
}

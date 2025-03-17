export interface Order {
  id: string;
  customer: string;
  fieldType: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: string;
}

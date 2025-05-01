export interface Order {
  id: string;
  customer: string;
  fieldType: string;
  date: string;
  time: string;
  duration: number | string;
  amount: number | string;
  status: string;
  paymentMethod: string;
}

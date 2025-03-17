export interface Order {
  id: string;
  customer: string;
  fieldType: string;
  date: string;
  startTime?: string;
  time: string;
  duration: number | string;
  totalPrice: number | string;
  status: string;
}

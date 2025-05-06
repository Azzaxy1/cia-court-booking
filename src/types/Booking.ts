import { CourtReal, CourtType } from "./court";

type PaymentMethod = "Cash" | "BankTransfer" | "CreditCard" | "EWallet";
export type BookingStatus = "Pending" | "Paid" | "Canceled" | "Refunded";

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  court: CourtReal;
  courtType: CourtType;
  startTime: Date;
  endTime: Date;
  duration: number;
  date: Date;
  paymentMethod: PaymentMethod;
  isConfirmed: boolean;
  amount: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

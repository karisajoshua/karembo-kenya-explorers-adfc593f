import type { Database } from "@/integrations/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentAudit = Database["public"]["Tables"]["payment_audit"]["Row"];
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  partially_paid: "Partially paid",
  paid: "Paid",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  mpesa: "M-Pesa",
  bank_transfer: "Bank transfer",
  card_manual: "Card (manual/POS)",
  cheque: "Cheque",
  other: "Other",
};

export const statusClass = (s: BookingStatus) =>
  ({
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-secondary text-secondary-foreground",
    partially_paid: "bg-accent/30 text-primary",
    paid: "bg-accent text-accent-foreground",
    completed: "bg-primary text-primary-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  })[s];

export const money = (n: number | null | undefined, cur = "USD") =>
  `${cur} ${Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

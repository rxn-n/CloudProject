export interface BookingDetails {
  ticketId: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: 'credit_card' | 'debit_card';
}
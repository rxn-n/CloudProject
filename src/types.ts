export interface Ticket {
  id: string;
  name: string;
  category: 'CAT1' | 'CAT2' | 'CAT3';
  status: 'available' | 'sold_out';
  price: number;
  date: string;
  venue: string;
  image: string;
  artist: string;
  quantity: number;
}

export interface TicketGroup {
  name: string;
  categories: {
    category: string;
    tickets: Ticket[];
  }[];
}

export interface BookingDetails {
  ticketId: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: 'credit_card' | 'debit_card';
}
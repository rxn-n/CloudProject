import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TicketList } from './components/TicketList';
import { ClientTicketView } from './components/ClientTicketView';
import { NotificationLog } from './components/NotificationLog';
import { QueueLanding } from './components/QueueLanding';
import { BookingPage } from './components/BookingPage';
import { BookingSuccess } from './components/BookingSuccess';
import type { Ticket, TicketGroup } from './types';
import { LayoutGrid } from 'lucide-react';

// Update mock data to include quantity
const mockTickets: Ticket[] = [
  {
    id: '1',
    name: 'Eras Tour',
    category: 'CAT1',
    status: 'available',
    price: 150,
    date: '2024-04-15',
    venue: 'National Stadium, Singapore',
    image: 'https://th.bing.com/th/id/R.9bdfcb466cba237265b5d0327bc74904?rik=uQx147UWAxm8ng&riu=http%3a%2f%2fmulticinestenerife.com%2fwp-content%2fuploads%2f2023%2f10%2fSlider-Taylor.jpg&ehk=gvCNAT4gmKQdnq1eLAeZVmx3M%2bXiEIXOzhGkDDC7om8%3d&risl=&pid=ImgRaw&r=0',
    artist: 'Taylor Swift',
    quantity: 4
  },
    {
    id: '2',
    name: 'Eras Tour',
    category: 'CAT2',
    status: 'available',
    price: 130,
    date: '2024-04-15',
    venue: 'National Stadium, Singapore',
    image: 'https://th.bing.com/th/id/R.9bdfcb466cba237265b5d0327bc74904?rik=uQx147UWAxm8ng&riu=http%3a%2f%2fmulticinestenerife.com%2fwp-content%2fuploads%2f2023%2f10%2fSlider-Taylor.jpg&ehk=gvCNAT4gmKQdnq1eLAeZVmx3M%2bXiEIXOzhGkDDC7om8%3d&risl=&pid=ImgRaw&r=0',
    artist: 'Taylor Swift',
    quantity: 4
  },
    {
    id: '3',
    name: 'World Tour',
    category: 'CAT1',
    status: 'available',
    price: 150,
    date: '2024-04-15',
    venue: 'National Stadium, Singapore',
    image: 'https://www.hipjpn.co.jp/live/brunomars2024/images/kv_artist_en_pc.jpg',
    artist: 'Bruno Mars',
    quantity: 4
  },
      {
    id: '4',
    name: 'World Tour',
    category: 'CAT2',
    status: 'available',
    price: 130,
    date: '2024-04-15',
    venue: 'National Stadium, Singapore',
    image: 'https://www.hipjpn.co.jp/live/brunomars2024/images/kv_artist_en_pc.jpg',
    artist: 'Bruno Mars',
    quantity: 4
  },
  // ... (update other ticket objects with quantity property)
];

export default function App() {
  const [isAdminView, setIsAdminView] = React.useState(false);
  const [isInQueue, setIsInQueue] = React.useState(true);
  const [tickets, setTickets] = React.useState<Ticket[]>(mockTickets);
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    message: string;
    timestamp: string;
    type: 'success' | 'error' | 'info';
  }>>([]);

  const ticketGroups: TicketGroup[] = React.useMemo(() => {
    const groups: Record<string, Record<string, Ticket[]>> = {};
    
    tickets.forEach((ticket) => {
      if (!groups[ticket.name]) {
        groups[ticket.name] = {};
      }
      if (!groups[ticket.name][ticket.category]) {
        groups[ticket.name][ticket.category] = [];
      }
      groups[ticket.name][ticket.category].push(ticket);
    });

    return Object.entries(groups).map(([name, categories]) => ({
      name,
      categories: Object.entries(categories).map(([category, tickets]) => ({
        category,
        tickets: tickets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }))
    }));
  }, [tickets]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message,
        timestamp: new Date().toISOString(),
        type
      },
      ...prev.slice(0, 9)
    ]);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: 'available' | 'sold_out') => {
    try {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );

      addNotification(
        `Ticket status updated to ${newStatus}`,
        'success'
      );
    } catch (error) {
      addNotification(
        'Failed to update ticket status',
        'error'
      );
    }
  };

  const handleUpdateCategoryStatus = async (
    name: string,
    category: string,
    newStatus: 'available' | 'sold_out'
  ) => {
    try {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.name === name && ticket.category === category
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );

      addNotification(
        `All tickets in ${name} - Category ${category} updated to ${newStatus}`,
        'success'
      );
    } catch (error) {
      addNotification(
        `Failed to update ${name} - Category ${category} status`,
        'error'
      );
    }
  };

  const handleBookTicket = async (ticketId: string, quantity: number = 1) => {
    try {
      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.id === ticketId) {
            const newQuantity = ticket.quantity - quantity;
            return {
              ...ticket,
              quantity: newQuantity,
              status: newQuantity <= 0 ? 'sold_out' : 'available'
            };
          }
          return ticket;
        })
      );

      addNotification(
        'Ticket booked successfully! Check your email for confirmation.',
        'success'
      );
    } catch (error) {
      addNotification(
        'Failed to book ticket. Please try again.',
        'error'
      );
      throw error;
    }
  };

  if (isInQueue) {
    return <QueueLanding onQueueComplete={() => setIsInQueue(false)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-lg shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LayoutGrid className="w-8 h-8 text-indigo-600" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  TicketMaster
                </h1>
              </div>
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600
                  rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg"
              >
                Switch to {isAdminView ? 'Client' : 'Admin'} View
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {isAdminView ? (
                      <TicketList
                        ticketGroups={ticketGroups}
                        onUpdateStatus={handleUpdateStatus}
                        onUpdateCategoryStatus={handleUpdateCategoryStatus}
                      />
                    ) : (
                      <ClientTicketView
                        ticketGroups={ticketGroups}
                        onBookTicket={handleBookTicket}
                      />
                    )}
                  </div>
                  <div>
                    <NotificationLog notifications={notifications} />
                  </div>
                </div>
              }
            />
            <Route
              path="/booking"
              element={<BookingPage onBookingComplete={handleBookTicket} />}
            />
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
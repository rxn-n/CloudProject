import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket as TicketIcon, Calendar, MapPin, ChevronDown, Music2, Users, Star } from 'lucide-react';
import type { Ticket, TicketGroup } from '../types';

interface ClientTicketViewProps {
  ticketGroups: TicketGroup[];
  onBookTicket: (ticketId: string) => void;
}

export function ClientTicketView({ ticketGroups }: ClientTicketViewProps) {
  const navigate = useNavigate();
  const [expandedConcerts, setExpandedConcerts] = React.useState<Set<string>>(new Set());
  const [hoveredTicket, setHoveredTicket] = React.useState<string | null>(null);

  const toggleConcert = (name: string) => {
    setExpandedConcerts(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Music2 className="w-10 h-10 text-indigo-600" />
          Upcoming Concerts
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Book your tickets for the most anticipated concerts. Secure your spot and create unforgettable memories.
        </p>
      </div>
      
      <div className="space-y-8">
        {ticketGroups.map((group) => {
          const firstTicket = group.categories[0]?.tickets[0];
          const totalAvailable = group.categories.reduce(
            (acc, cat) => acc + cat.tickets.filter(t => t.status === 'available').length,
            0
          );

          return (
            <div 
              key={group.name} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl
                ${expandedConcerts.has(group.name) ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={firstTicket?.image}
                  alt={group.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">Featured Artist</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{firstTicket?.artist}</h2>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      {totalAvailable} tickets available
                    </span>
                    <button
                      onClick={() => toggleConcert(group.name)}
                      className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700
                        transform hover:scale-105 transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div 
                className={`transition-all duration-500 ease-in-out
                  ${expandedConcerts.has(group.name) 
                    ? 'max-h-[2000px] opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="border-t border-gray-100">
                  {group.categories.map((category) => {
                    const availableTickets = category.tickets.filter(t => t.status === 'available');
                    if (availableTickets.length === 0) return null;

                    return (
                      <div key={category.category} className="p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-2 mb-6">
                          <TicketIcon className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-xl font-semibold text-gray-900">
                            Category {category.category}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {availableTickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className={`relative bg-gray-50 rounded-xl p-6 transform transition-all duration-300
                                ${hoveredTicket === ticket.id 
                                  ? 'scale-[1.02] shadow-md bg-gray-100' 
                                  : 'hover:shadow-sm'}`}
                              onMouseEnter={() => setHoveredTicket(ticket.id)}
                              onMouseLeave={() => setHoveredTicket(null)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
                                      <Calendar className="w-4 h-4" />
                                      <span>{new Date(ticket.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
                                      <MapPin className="w-4 h-4" />
                                      <span>{ticket.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
                                      <Users className="w-4 h-4" />
                                      <span>{ticket.quantity} tickets left</span>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    ${ticket.price.toFixed(2)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => navigate('/booking', { state: { ticket } })}
                                  className={`relative group bg-indigo-600 text-white px-8 py-3 rounded-xl
                                    font-semibold transition-all duration-300 hover:bg-indigo-700
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                    transform hover:translate-y-[-2px] active:translate-y-[0px]`}
                                >
                                  <span className="relative z-10">Book Now</span>
                                  <div className="absolute inset-0 h-full w-full bg-white rounded-xl 
                                    transform scale-x-0 group-hover:scale-x-100 origin-left 
                                    transition-transform duration-300 opacity-10">
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
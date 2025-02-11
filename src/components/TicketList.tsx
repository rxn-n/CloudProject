import React from 'react';
import { ChevronDown, ChevronUp, Ticket as TicketIcon, Star } from 'lucide-react';
import type { Ticket, TicketGroup } from '../types';

interface TicketListProps {
  ticketGroups: TicketGroup[];
  onUpdateStatus: (ticketId: string, newStatus: 'available' | 'sold_out') => void;
  onUpdateCategoryStatus: (name: string, category: string, newStatus: 'available' | 'sold_out') => void;
}

export function TicketList({ ticketGroups, onUpdateStatus, onUpdateCategoryStatus }: TicketListProps) {
  const [expandedConcerts, setExpandedConcerts] = React.useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

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
    <div className="space-y-6">
      {ticketGroups.map((group) => {
        const firstTicket = group.categories[0]?.tickets[0];
        return (
          <div key={group.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-48 overflow-hidden">
                <img
                  src={firstTicket?.image}
                  alt={group.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{firstTicket?.artist}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{group.name}</h3>
                  </div>
                  <button
                    onClick={() => toggleConcert(group.name)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg
                      hover:bg-white/30 transition-all duration-300"
                  >
                    {expandedConcerts.has(group.name) ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        <span>Hide Details</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        <span>Show Details</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {expandedConcerts.has(group.name) && (
              <div className="divide-y divide-gray-100">
                {group.categories.map((categoryGroup) => (
                  <div key={categoryGroup.category} className="bg-white">
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Category {categoryGroup.category}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdateCategoryStatus(group.name, categoryGroup.category, 'available')}
                          className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200
                            transition-all duration-300 transform hover:scale-105"
                        >
                          Set All Available
                        </button>
                        <button
                          onClick={() => onUpdateCategoryStatus(group.name, categoryGroup.category, 'sold_out')}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200
                            transition-all duration-300 transform hover:scale-105"
                        >
                          Set All Sold Out
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 grid grid-cols-5 gap-4">
                        <div>Date</div>
                        <div>Venue</div>
                        <div>Price</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      {categoryGroup.tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`px-6 py-4 grid grid-cols-5 gap-4 items-center transition-all duration-300
                            ${hoveredRow === ticket.id ? 'bg-gray-50 transform scale-[1.01]' : 'hover:bg-gray-50'}`}
                          onMouseEnter={() => setHoveredRow(ticket.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <div className="text-gray-900 font-medium">
                            {new Date(ticket.date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-900">{ticket.venue}</div>
                          <div className="text-gray-900 font-medium">
                            ${ticket.price.toFixed(2)}
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${
                                  ticket.status === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                            >
                              {ticket.status === 'available' ? 'Available' : 'Sold Out'}
                            </span>
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                onUpdateStatus(
                                  ticket.id,
                                  ticket.status === 'available' ? 'sold_out' : 'available'
                                )
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                transform hover:scale-105
                                ${
                                  ticket.status === 'available'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                              {ticket.status === 'available'
                                ? 'Mark Sold Out'
                                : 'Mark Available'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
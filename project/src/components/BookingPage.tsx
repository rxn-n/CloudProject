import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Mail, User, Calendar, MapPin, Ticket as TicketIcon, ArrowLeft, Shield } from 'lucide-react';
import type { Ticket } from '../types';

interface BookingPageProps {
  onBookingComplete: (ticketId: string, quantity: number) => Promise<void>;
}

export function BookingPage({ onBookingComplete }: BookingPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket as Ticket;

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    quantity: 1,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    agreeToTerms: false
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Ticket</h2>
          <p className="text-gray-600 mb-6">This ticket is no longer available or has expired.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = ticket.price * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await onBookingComplete(ticket.id, formData.quantity);
      
      // Show success message and redirect
      navigate('/booking-success', {
        state: {
          ticketDetails: {
            ...ticket,
            quantity: formData.quantity,
            totalPrice,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail
          }
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Tickets
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Ticket Summary */}
            <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
              <div className="mb-8">
                <TicketIcon className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{ticket.name}</h2>
                <p className="text-indigo-200">{ticket.artist}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>{new Date(ticket.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>{ticket.venue}</span>
                </div>
                <div className="flex items-center">
                  <TicketIcon className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>Category {ticket.category}</span>
                </div>

                <div className="pt-4 mt-4 border-t border-indigo-400">
                  <div className="flex justify-between mb-2">
                    <span>Price per ticket</span>
                    <span>${ticket.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Quantity</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-indigo-400">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </div>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <TicketIcon className="w-4 h-4" />
                        Number of Tickets
                      </div>
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'ticket' : 'tickets'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.expiryDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.cvv}
                            onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the terms and conditions and cancellation policy
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <Shield className="w-6 h-6 text-green-600" />
                  <p className="text-sm text-gray-600">
                    Your payment is secure and encrypted
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    transition-all duration-300 ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
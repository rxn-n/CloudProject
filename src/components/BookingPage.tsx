import React from 'react';
import { ArrowLeft, Ticket as TicketIcon, Calendar, MapPin, User, Mail, CreditCard, Shield } from 'lucide-react';

export function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group">
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Tickets
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Ticket Summary */}
            <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
              <div className="mb-8">
                <TicketIcon className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Event Name</h2>
                <p className="text-indigo-200">Artist Name</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>Event Date</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>Event Venue</span>
                </div>
                <div className="flex items-center">
                  <TicketIcon className="w-5 h-5 mr-3 text-indigo-200" />
                  <span>Category</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300">
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'ticket' : 'tickets'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-6 border-t">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-600">I agree to the terms and conditions</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <Shield className="w-6 h-6 text-green-600" />
                  <p className="text-sm text-gray-600">Your payment is secure</p>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all">
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
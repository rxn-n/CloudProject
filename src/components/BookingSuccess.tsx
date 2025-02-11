import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Calendar, MapPin, Ticket as TicketIcon, Users } from 'lucide-react';

export function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketDetails = location.state?.ticketDetails;

  if (!ticketDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Booking</h2>
          <p className="text-gray-600 mb-6">No booking details found.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-green-100">
              Your tickets have been booked successfully
            </p>
          </div>

          {/* Ticket Details */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {ticketDetails.name}
                </h3>
                <p className="text-gray-600">{ticketDetails.artist}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(ticketDetails.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-medium text-gray-900">{ticketDetails.venue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TicketIcon className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{ticketDetails.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium text-gray-900">{ticketDetails.quantity} tickets</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Price per ticket</span>
                  <span className="font-medium">${ticketDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{ticketDetails.quantity}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Paid</span>
                  <span className="font-bold text-xl text-indigo-600">
                    ${ticketDetails.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl
                  hover:bg-indigo-700 transition-colors">
                  <Download className="w-5 h-5" />
                  Download Tickets
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 py-3 rounded-xl
                  border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share Ticket Details
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
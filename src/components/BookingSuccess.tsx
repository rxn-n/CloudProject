import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketDetails = location.state?.ticketDetails;

  // Redirect to home if no ticket details exist
  useEffect(() => {
    if (!ticketDetails) {
      navigate('/', { replace: true });
    }
  }, [ticketDetails, navigate]);

  if (!ticketDetails) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center">Booking Confirmed!</h2>
        <p className="text-gray-700 text-center mt-2">Thank you for your purchase, {ticketDetails.fullName}!</p>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">Event</p>
            <p className="font-medium">{ticketDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Artist</p>
            <p className="font-medium">{ticketDetails.artist}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{new Date(ticketDetails.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Venue</p>
            <p className="font-medium">{ticketDetails.venue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{ticketDetails.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="font-medium">{ticketDetails.quantity}</p>
          </div>
          <div className="border-t border-gray-300 pt-3">
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="font-semibold text-lg">${ticketDetails.totalPrice}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

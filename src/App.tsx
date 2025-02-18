import React from 'react';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientTicketView } from './components/ClientTicketView';
import { QueueForward } from './components/QueueProcessing';
import { QueueLanding } from './components/QueueLanding';
import { BookingPage } from './components/BookingPage';
import { BookingSuccess } from './components/BookingSuccess';
import { LayoutGrid } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-lg shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LayoutGrid className="w-8 h-8 text-indigo-600" />
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  TicketMaster
                </p>
              </div>
              {/* <button
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600
                  rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg"
              >
                Switch View
              </button> */}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={<ClientTicketView />}
            />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/queue-processing" element={<QueueForward />} />
            <Route path="/queue" element={<QueueLanding onQueueComplete={() => {}} />} />
          <Route path="/purchase-ticket/:concertId" element={<BookingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
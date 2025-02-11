import React, { useEffect, useState } from 'react';
import { Timer, Users, Ticket as TicketIcon, ArrowRight, Loader2 } from 'lucide-react';

interface QueueLandingProps {
  onQueueComplete: () => void;
  initialPosition?: number;
  estimatedWaitTime?: number;
}

export function QueueLanding({ 
  onQueueComplete, 
  initialPosition = 3, 
  estimatedWaitTime = 0.1 
}: QueueLandingProps) {
  const [position, setPosition] = useState(initialPosition);
  const [timeRemaining, setTimeRemaining] = useState(estimatedWaitTime * 60); // Convert to seconds
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Simulate queue position updates
    const positionInterval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = prev - Math.floor(Math.random() * 1 + 1);
        if (newPosition <= 0) {
          clearInterval(positionInterval);
          setIsRedirecting(true);
          setTimeout(() => {
            onQueueComplete();
          }, 2000);
          return 0;
        }
        return newPosition;
      });
    }, 2000);

    // Update time remaining
    const timeInterval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(positionInterval);
      clearInterval(timeInterval);
    };
  }, [onQueueComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.max(0, Math.min(100, ((initialPosition - position) / initialPosition) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <TicketIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isRedirecting ? "You're up next!" : "You're in line!"}
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {isRedirecting 
                ? "We're redirecting you to the ticket booking page..." 
                : "Please wait while we secure your spot. Don't close this window."}
            </p>
          </div>

          {!isRedirecting && (
            <div className="space-y-8">
              {/* Progress bar */}
              <div className="relative pt-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 text-center transform transition-all hover:scale-105">
                  <Users className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Your position</p>
                  <p className="text-2xl font-bold text-gray-900">{position.toLocaleString()}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-center transform transition-all hover:scale-105">
                  <Timer className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Estimated wait time</p>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(timeRemaining)}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-center transform transition-all hover:scale-105">
                  <ArrowRight className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Next update in</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <span className="tabular-nums">0:02</span>
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Don't refresh this page. We'll automatically redirect you when it's your turn.</p>
              </div>
            </div>
          )}

          {isRedirecting && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600">Preparing your ticket booking experience...</p>
            </div>
          )}
        </div>

        {/* Tips section */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">While you wait:</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
              Have your payment information ready
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
              Decide on your preferred ticket category
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
              Check the venue location and date
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationLogProps {
  notifications: Notification[];
}

export function NotificationLog({ notifications }: NotificationLogProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Info className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl transition-all duration-300 hover:shadow-md
                ${
                  notification.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : notification.type === 'error'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
                }`}
            >
              <div className="flex items-start gap-3">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : notification.type === 'error' ? (
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
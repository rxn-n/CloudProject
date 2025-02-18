import React, { useEffect, useState } from 'react';

export function QueueForward() {
  const [position, setPosition] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Establish WebSocket connection when the component mounts
  useEffect(() => {
    const websocket = new WebSocket(
      'wss://vcexv514vc.execute-api.us-east-1.amazonaws.com/production'
    );
    setWs(websocket);

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, []);

  const handleRefresh = () => {
    if (ws) {
      // Send a message to the WebSocket server to request updated position
      const message = {
        action: 'updatePosition',
        requestContext: {
          connectionId: (ws as any)._connectionId, // Assuming you have this connection ID available
        },
      };
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6">Queue Position</h1>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Refresh Position
        </button>
        {position && (
          <p id="queuePosition" className="mt-6 text-lg text-gray-700">
            {position}
          </p>
        )}
      </div>
    </div>
  );
}
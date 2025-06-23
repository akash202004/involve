"use client";

import React, { useState, useEffect, useRef } from "react";
import socketManager from "@/lib/socket";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ConnectionStatus {
  connected: boolean;
  socketId: string | null;
  reconnectAttempts: number;
  maxAttempts: number;
  eventQueueSize: number;
  lastEvent?: string;
  lastEventTime?: string;
}

interface LocationData {
  type: 'worker' | 'user';
  lat: number;
  lng: number;
  timestamp: string;
}

// Custom icons
const workerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2838/2838694.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Add these at the top, after imports
const jobId = "test-job-123"; // TODO: Replace with real jobId from props/context
const userId = "user-abc";    // TODO: Replace with real userId from auth/context

const SocketConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    socketId: null,
    reconnectAttempts: 0,
    maxAttempts: 5,
    eventQueueSize: 0,
    lastEvent: undefined,
    lastEventTime: undefined
  });
  const [testResults, setTestResults] = useState<string[]>([]);
  const [locations, setLocations] = useState<{
    worker?: LocationData;
    user?: LocationData;
  }>({});
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  // const { toast } = useToast();

  useEffect(() => {
    const updateStatus = () => {
      const status = socketManager.getConnectionStatus();
      setConnectionStatus(prev => ({
        ...prev,
        ...status,
        lastEvent: (status as any).lastEvent || prev.lastEvent,
        lastEventTime: (status as any).lastEventTime || prev.lastEventTime
      }));
    };

    // Initial status update
    updateStatus();

    // Set up interval for status updates
    const interval = setInterval(updateStatus, 2000);

    // Set up socket event listeners
    const onLocationUpdate = (data: LocationData) => {
      setLocations(prev => ({
        ...prev,
        [data.type]: data
      }));

      setConnectionStatus(prev => ({
        ...prev,
        lastEvent: 'location_update',
        lastEventTime: new Date().toLocaleTimeString()
      }));

      // Update map view if we have both locations
      if (
        mapRef.current &&
        prevHasLocation(locations, 'worker') &&
        prevHasLocation(locations, 'user')
      ) {
        const bounds = L.latLngBounds(
          [locations.worker!.lat, locations.worker!.lng],
          [locations.user!.lat, locations.user!.lng]
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    const onChatMessage = (data: any) => {
      setConnectionStatus(prev => ({
        ...prev,
        lastEvent: 'chat_message',
        lastEventTime: new Date().toLocaleTimeString()
      }));
      setTestResults(prev => [...prev, `Chat: ${data.sender}: ${data.message}`]);
    };

    socketManager.on('location_update', onLocationUpdate);
    socketManager.on('chat_message', onChatMessage);

    return () => {
      clearInterval(interval);
      socketManager.off('location_update', onLocationUpdate);
      socketManager.off('chat_message', onChatMessage);
    };
  }, [locations.worker, locations.user]);

  // Helper type guard
  function prevHasLocation(obj: any, key: 'worker' | 'user'): obj is { [k in 'worker' | 'user']?: LocationData } {
    return obj && obj[key] && typeof obj[key].lat === 'number' && typeof obj[key].lng === 'number';
  }

  // Join/leave job room on mount/unmount
  useEffect(() => {
    socketManager.emit('join_job', jobId);
    return () => {
      socketManager.emit('leave_job', jobId);
    };
  }, []);

  // Send worker location
  const sendWorkerLocation = (lat: number, lng: number) => {
    socketManager.emit('worker_location_update', { jobId, lat, lng });
  };

  // Send user location
  const sendUserLocation = (lat: number, lng: number) => {
    socketManager.emit('user_location_update', { jobId, userId, lat, lng });
  };

  const testConnection = () => {
    setTestResults(prev => [...prev, "Sending test message..."]);
    socketManager.testConnection();
  };

  const reconnect = () => {
    setTestResults(prev => [...prev, "Attempting manual reconnect..."]);
    socketManager.connect();
    // toast({
    //   title: "Connection",
    //   description: "Attempting to reconnect...",
    // });
  };

  const disconnect = () => {
    setTestResults(prev => [...prev, "Disconnecting..."]);
    socketManager.disconnect();
    // toast({
    //   title: "Connection",
    //   description: "Disconnected from socket server",
    // });
  };

  const simulateLocationUpdate = () => {
    const newLat = 51.505 + (Math.random() * 0.02 - 0.01);
    const newLng = -0.09 + (Math.random() * 0.02 - 0.01);
    
    setTestResults(prev => [...prev, "Simulating worker location update..."]);
    socketManager.emit('worker_location_update', {
      jobId: 'test-job',
      lat: newLat,
      lng: newLng
    });
  };

  const simulateChatMessage = () => {
    const messages = [
      "Hello! I'm your driver",
      "I'm on my way",
      "I'll arrive in 5 minutes",
      "I've arrived at your location",
      "Please look for my vehicle"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setTestResults(prev => [...prev, `Sending chat: ${randomMessage}`]);
    socketManager.emit('job_chat', {
      jobId: 'test-job',
      sender: 'driver-123',
      message: randomMessage
    });
  };

  const toggleMap = () => {
    setMapExpanded(!mapExpanded);
    setTimeout(() => {
      if (mapRef.current && locations.worker && locations.user) {
        const bounds = L.latLngBounds(
          [locations.worker.lat, locations.worker.lng],
          [locations.user.lat, locations.user.lng]
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 100);
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border z-50 ${mapExpanded ? 'w-96' : 'w-72'}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">Live Connection Monitor</h3>
          <button 
            onClick={toggleMap}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            {mapExpanded ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus.connected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span>
                Status:{" "}
                <span className={connectionStatus.connected ? "text-green-600" : "text-red-600"}>
                  {connectionStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </span>
            </div>
            {connectionStatus.socketId && (
              <span className="text-gray-500 text-xs truncate max-w-[120px]">
                ID: {connectionStatus.socketId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-gray-500">Reconnect Attempts:</div>
              <div>
                {connectionStatus.reconnectAttempts}/{connectionStatus.maxAttempts}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Queue Size:</div>
              <div>{connectionStatus.eventQueueSize}</div>
            </div>
          </div>

          {connectionStatus.lastEvent && (
            <div>
              <div className="text-gray-500">Last Event:</div>
              <div className="flex justify-between">
                <span>{connectionStatus.lastEvent}</span>
                <span className="text-gray-400">{connectionStatus.lastEventTime}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={testConnection}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test
          </button>
          <button
            onClick={reconnect}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Reconnect
          </button>
          <button
            onClick={disconnect}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Disconnect
          </button>
          <button
            onClick={simulateLocationUpdate}
            className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            Simulate Location
          </button>
          <button
            onClick={simulateChatMessage}
            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
          >
            Simulate Chat
          </button>
          <button
            onClick={() => sendWorkerLocation(51.505, -0.09)}
            className="px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
          >
            Send Worker Location
          </button>
          <button
            onClick={() => sendUserLocation(51.51, -0.1)}
            className="px-2 py-1 bg-pink-500 text-white text-xs rounded hover:bg-pink-600"
          >
            Send User Location
          </button>
        </div>
      </div>

      {mapExpanded && (
        <div className="h-64 border-t">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {locations.worker && (
              <Marker
                position={[locations.worker.lat, locations.worker.lng]}
                icon={workerIcon}
              >
                <Popup>
                  Worker Location <br />
                  {new Date(locations.worker.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            )}

            {locations.user && (
              <Marker
                position={[locations.user.lat, locations.user.lng]}
                icon={userIcon}
              >
                <Popup>
                  User Location <br />
                  {new Date(locations.user.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            )}

            {locations.worker && locations.user && (
              <Polyline
                positions={[
                  [locations.worker.lat, locations.worker.lng],
                  [locations.user.lat, locations.user.lng],
                ]}
                color="blue"
              />
            )}
          </MapContainer>
        </div>
      )}

      <div className="p-2 border-t max-h-32 overflow-y-auto">
        <div className="font-semibold text-xs mb-1">Event Log:</div>
        <div className="text-xs space-y-1">
          {testResults.slice(-5).map((result, index) => (
            <div key={index} className="text-gray-600 border-b pb-1">
              [{new Date().toLocaleTimeString()}] {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocketConnectionTest;
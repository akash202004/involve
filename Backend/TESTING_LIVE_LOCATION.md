# Testing Live Location Tracking System

## 🧪 Quick Start Testing

### Prerequisites

1. **Server Running**: Make sure your backend server is running
2. **Dependencies**: Install socket.io-client for testing
3. **Database**: PostgreSQL should be running (optional for basic testing)

### Step 1: Start the Server

```bash
cd Backend
npm run dev
```

### Step 2: Run the Simple Test

```bash
cd Backend
node test-location-simple.js
```

## 📋 What the Test Does

The test script simulates:

1. **Worker Connection** - Connects as a worker
2. **Job Acceptance** - Simulates accepting a job
3. **Location Updates** - Sends 5 location updates every 2 seconds
4. **User Connection** - Connects as a user to receive updates
5. **Real-time Updates** - Shows location updates being received
6. **Job Completion** - Completes the job and stops tracking

## 🔍 Expected Output

```
🧪 Simple Live Location Tracking Test
=====================================
🚀 Test started. Press Ctrl+C to stop.
📡 Connecting to server at: http://localhost:3000
✅ Worker connected to server
🔌 Socket ID: [socket-id]
✅ User connected to server
🔌 Socket ID: [socket-id]
🤝 Simulating job acceptance...
✅ Job accepted successfully
📱 Tracking enabled: true
📍 Starting location updates...
✅ User notified of job acceptance
👷 Worker info: [worker-data]
📍 Tracking enabled: true
📍 Sending location update #1: 22.572123 88.363456
✅ Location updated successfully: 2024-01-15T10:30:00.000Z
📍 Worker location update received:
   - Job ID: test-job-123
   - Worker ID: test-worker-456
   - Location: 22.572123 88.363456
   - Timestamp: 2024-01-15T10:30:00.000Z
📍 Sending location update #2: 22.573456 88.364789
✅ Location updated successfully: 2024-01-15T10:30:02.000Z
📍 Worker location update received:
   - Job ID: test-job-123
   - Worker ID: test-worker-456
   - Location: 22.573456 88.364789
   - Timestamp: 2024-01-15T10:30:02.000Z
...
✅ Completing job...
📍 Tracking stopped: Job completed. Location tracking stopped.
🎉 Test completed successfully!
```

## 🛠️ Manual Testing Options

### Option 1: Using Postman/Thunder Client

#### Test Job Creation

```http
POST http://localhost:3000/api/jobs
Content-Type: application/json

{
  "userId": "test-user-123",
  "description": "Test plumbing job",
  "location": "123 Test Street, Kolkata",
  "lat": 22.5726,
  "lng": 88.3639,
  "bookedFor": "2024-01-15T14:30:00.000Z",
  "durationMinutes": 60
}
```

#### Test Tracking Sessions

```http
GET http://localhost:3000/api/live-locations/tracking/sessions
```

#### Test Tracking Status

```http
GET http://localhost:3000/api/live-locations/tracking/status/test-job-123
```

### Option 2: Using Browser Console

#### Connect as Worker

```javascript
// In browser console
const workerSocket = io("http://localhost:3000");

workerSocket.on("connect", () => {
  console.log("Worker connected");

  // Accept a job
  workerSocket.emit("accept_job", {
    jobId: "test-job-123",
    workerId: "test-worker-456",
  });
});

workerSocket.on("job_accepted_success", (data) => {
  console.log("Job accepted:", data);

  // Send location update
  workerSocket.emit("update_location", {
    jobId: "test-job-123",
    workerId: "test-worker-456",
    lat: 22.5726,
    lng: 88.3639,
  });
});

workerSocket.on("location_updated", (data) => {
  console.log("Location updated:", data);
});
```

#### Connect as User

```javascript
// In another browser tab
const userSocket = io("http://localhost:3000");

userSocket.on("connect", () => {
  console.log("User connected");
  userSocket.emit("join_user_room", { userId: "test-user-123" });
});

userSocket.on("job_accepted", (data) => {
  console.log("Job accepted by worker:", data);
});

userSocket.on("worker_location_update", (data) => {
  console.log("Worker location:", data);
});
```

### Option 3: Using curl

#### Test API Endpoints

```bash
# Get active tracking sessions
curl http://localhost:3000/api/live-locations/tracking/sessions

# Get tracking status for a job
curl http://localhost:3000/api/live-locations/tracking/status/test-job-123

# Stop tracking for a job
curl -X POST http://localhost:3000/api/live-locations/tracking/stop/test-job-123
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Connection Refused

```
❌ Worker connection error: connect ECONNREFUSED
```

**Solution**: Make sure the server is running on port 3000

#### 2. Socket.IO Not Found

```
❌ Error: Cannot find module 'socket.io-client'
```

**Solution**: Install the dependency

```bash
cd Backend
npm install socket.io-client
```

#### 3. Job Not Found Error

```
❌ Job error: Job not found
```

**Solution**: This is expected for test jobs. The system will still work for socket events.

#### 4. Database Connection Issues

```
❌ Database connection failed
```

**Solution**: Make sure PostgreSQL is running and configured correctly.

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=socket.io:* npm run dev
```

## 📊 Testing Scenarios

### Scenario 1: Normal Flow

1. Worker accepts job → Tracking starts
2. Worker sends location updates → User receives updates
3. Worker completes job → Tracking stops

### Scenario 2: Connection Loss

1. Worker accepts job → Tracking starts
2. Worker disconnects → User notified, tracking stops
3. Worker reconnects → Can resume if job still active

### Scenario 3: Multiple Workers

1. Multiple workers accept same job
2. Only first worker gets tracking enabled
3. Others receive "job unavailable" notification

### Scenario 4: Invalid Updates

1. Worker tries to update location for wrong job
2. System rejects unauthorized updates
3. Error message sent to worker

## 🎯 Success Criteria

A successful test should show:

- ✅ Worker connects successfully
- ✅ Job acceptance triggers tracking
- ✅ Location updates are sent and received
- ✅ User receives real-time location updates
- ✅ Job completion stops tracking
- ✅ No memory leaks or orphaned sessions

## 📱 Frontend Integration Testing

### React/Next.js Example

```javascript
import { useEffect, useState } from "react";
import io from "socket.io-client";

function WorkerTracking() {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("job_accepted_success", (data) => {
      console.log("Job accepted, start sharing location");
      startLocationSharing(data.job.id);
    });

    newSocket.on("worker_location_update", (data) => {
      setLocation({ lat: data.lat, lng: data.lng });
    });

    return () => newSocket.close();
  }, []);

  const startLocationSharing = (jobId) => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          socket.emit("update_location", {
            jobId,
            workerId: "current-worker-id",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    }
  };

  return (
    <div>
      <h2>Worker Location Tracking</h2>
      {location && (
        <p>
          Current Location: {location.lat}, {location.lng}
        </p>
      )}
    </div>
  );
}
```

## 🚀 Performance Testing

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Test with multiple concurrent users
artillery quick --count 10 --num 5 http://localhost:3000
```

### Memory Testing

```bash
# Monitor memory usage during testing
node --inspect test-location-simple.js
```

## 📈 Monitoring

### Key Metrics to Monitor

- Active tracking sessions count
- Location update frequency
- Socket connection stability
- Memory usage
- Error rates

### Log Analysis

```bash
# Monitor server logs
tail -f Backend/logs/server.log

# Filter location tracking logs
grep "LOCATION_TRACKING" Backend/logs/server.log
```

This comprehensive testing guide should help you verify that the live location tracking system is working correctly! 🎯

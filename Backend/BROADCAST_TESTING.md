# Job Broadcasting System - Testing & Debugging Guide

This guide helps you test and debug the job broadcasting system to ensure it's working correctly.

## 🚀 Quick Start Testing

### 1. Check Redis Installation

First, ensure Redis is installed and running:

**Windows:**

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

**Linux/Mac:**

```bash
# Install Redis if not installed
sudo apt-get install redis-server  # Ubuntu/Debian
brew install redis                 # Mac

# Start Redis
sudo systemctl start redis-server  # Ubuntu/Debian
brew services start redis          # Mac

# Test connection
redis-cli ping
```

### 2. Test Redis Connection

```bash
cd Backend
node test-redis.js
```

Expected output:

```
🧪 Testing Redis connection...
✅ Redis connection successful
✅ Redis publish successful
✅ Redis subscribe successful
📨 Received message: {"hello":"world"}
✅ Redis test completed successfully
```

### 3. Test Database Schema

```bash
cd Backend
node test-db-schema.js
```

Expected output:

```
🧪 Testing database schema...
📋 Checking table existence...
✅ Tables found: ['live_locations', 'specializations', 'workers']
📋 Checking live_locations columns...
✅ live_locations columns:
   - created_at: timestamp without time zone
   - id: uuid
   - lat: double precision
   - lng: double precision
   - worker_id: uuid
📋 Checking specializations columns...
✅ specializations columns:
   - category: character varying
   - created_at: timestamp without time zone
   - id: uuid
   - name: character varying
   - sub_category: character varying
   - worker_id: uuid
📋 Checking workers with locations...
✅ Workers with locations: 5
📋 Testing worker search query...
✅ Query successful! Found 3 workers
🎉 Database schema test completed successfully!
```

### 4. Start the Server

```bash
cd Backend
npm run dev
```

### 5. Monitor Console Output

Watch for these log patterns:

```
🚀 [SERVER] Starting server initialization...
🔌 [REDIS] Connecting to Redis...
✅ [REDIS] Successfully connected to Redis
🔌 [SOCKET] Initializing Socket.IO...
✅ [SOCKET] Socket.IO initialized
📡 [REDIS] Initializing job subscriber...
✅ [REDIS] Job subscriber initialized
🎉 [SERVER] Server running at http://localhost:5000
✅ [SERVER] All systems initialized successfully!
📊 BROADCAST SYSTEM STATUS
```

## 📊 Monitoring Endpoints

### Health Check

```bash
curl http://localhost:5000/api/jobs/health
```

**Response:**

```json
{
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "services": {
      "redis": {
        "status": "connected",
        "details": "Redis connection is active"
      },
      "database": {
        "status": "connected",
        "details": "Database connection is active"
      }
    }
  }
}
```

### Get Broadcast Metrics

```bash
curl http://localhost:5000/api/jobs/broadcast-metrics
```

**Response:**

```json
{
  "message": "Broadcast metrics retrieved successfully",
  "data": {
    "totalJobsCreated": 5,
    "totalJobsBroadcasted": 4,
    "totalWorkersNotified": 12,
    "averageWorkersPerJob": 3.0,
    "failedBroadcasts": 1,
    "successfulBroadcasts": 4,
    "uptime": "2h 15m 30s",
    "successRate": 80.0,
    "failureRate": 20.0,
    "lastJobProcessed": {
      "jobId": "uuid-here",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "workersFound": 3,
      "workersNotified": 3
    }
  }
}
```

### Reset Metrics

```bash
curl -X POST http://localhost:5000/api/jobs/broadcast-metrics/reset
```

## 🧪 Testing Job Creation & Broadcasting

### 1. Create a Test Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-uuid",
    "description": "Need a plumber to fix leaking pipe in kitchen",
    "location": "123 Test Street, Test City",
    "lat": 12.9716,
    "lng": 77.5946,
    "bookedFor": "2024-01-15T14:00:00Z",
    "durationMinutes": 120
  }'
```

### 2. Expected Console Output

```
🔄 [JOB_CREATION] Starting job creation process...
📝 [JOB_CREATION] Request body: {...}
✅ [JOB_CREATION] Data validation passed
📍 [JOB_CREATION] Job location: { lat: 12.9716, lng: 77.5946 }
✅ [JOB_CREATION] User verified: user@example.com
💾 [JOB_CREATION] Inserting job into database...
✅ [JOB_CREATION] Job created successfully with ID: uuid-here
📊 [METRICS] Job created - Total: 1
📡 [REDIS_PUBLISH] Publishing to Redis channel 'new-job'
✅ [REDIS_PUBLISH] Successfully published job to Redis
🎯 [BROADCAST] Job broadcasted to nearby workers
🎉 [JOB_CREATION] Job creation process completed successfully

📨 [REDIS_SUBSCRIBER] Received message from Redis channel 'new-job'
📋 [JOB_PROCESSING] Processing job: { jobId: "uuid-here", description: "Need a plumber to fix leaking pipe...", location: { lat: 12.9716, lng: 77.5946 }, userId: "user-uuid" }
🔍 [CATEGORY_DETECTION] Analyzing job description for category...
🏷️ [CATEGORY_DETECTION] Detected category: plumber
🔍 [WORKER_SEARCH] Starting worker search with progressive radius...
🔍 [WORKER_SEARCH] Searching within 5km radius...
📊 [WORKER_SEARCH] Found 3 workers within 5km
✅ [WORKER_SEARCH] Sufficient workers found at 5km radius
📊 [WORKER_ANALYSIS] Worker details found:
  1. John Doe - 2.34km away, 5 years exp
  2. Jane Smith - 3.12km away, 3 years exp
  3. Bob Wilson - 4.89km away, 7 years exp
🔄 [WORKER_SORTING] Workers sorted by distance and experience
📋 [WORKER_SELECTION] Selected top 3 workers for notification
📡 [SOCKET_BROADCAST] Starting Socket.IO broadcast to workers...
📤 [SOCKET_EMIT] Emitting to worker-uuid1: { workerName: "John Doe", distance: "2.34km", experience: "5 years" }
✅ [SOCKET_EMIT] Successfully notified worker uuid1
📤 [SOCKET_EMIT] Emitting to worker-uuid2: { workerName: "Jane Smith", distance: "3.12km", experience: "3 years" }
✅ [SOCKET_EMIT] Successfully notified worker uuid2
📤 [SOCKET_EMIT] Emitting to worker-uuid3: { workerName: "Bob Wilson", distance: "4.89km", experience: "7 years" }
✅ [SOCKET_EMIT] Successfully notified worker uuid3
🎯 [BROADCAST_SUMMARY] Successfully notified 3/3 workers for job uuid-here
📊 [METRICS] Broadcast successful - Job: uuid-here, Workers: 3/3
📊 [METRICS] Success rate: 100.00%
📤 [SOCKET_EMIT] Notifying user about successful broadcast
🎉 [JOB_PROCESSING] Job processing completed successfully
```

## 🔍 Testing Worker Matching

### Test Nearby Workers Endpoint

```bash
curl "http://localhost:5000/api/jobs/nearby-workers?lat=12.9716&lng=77.5946&radius=10&category=plumber"
```

**Response:**

```json
{
  "workers": [
    {
      "worker_id": "uuid1",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "experienceYears": 5,
      "lat": 12.975,
      "lng": 77.59,
      "distance": 2.34
    }
  ],
  "total": 1,
  "searchParams": {
    "lat": 12.9716,
    "lng": 77.5946,
    "radius": 10,
    "category": "plumber"
  }
}
```

## 🧪 Testing Socket Events

### 1. Connect Worker Socket

```javascript
// Frontend or test client
const socket = io("http://localhost:5000");

// Join worker room
socket.emit("join_worker_room", { workerId: "your-worker-uuid" });

// Listen for job requests
socket.on("job_request", (jobData) => {
  console.log("Received job request:", jobData);
});

// Accept a job
socket.emit("accept_job", {
  jobId: "job-uuid",
  workerId: "your-worker-uuid",
});

// Listen for acceptance confirmation
socket.on("job_accepted_success", (data) => {
  console.log("Job accepted:", data);
});
```

### 2. Connect User Socket

```javascript
const socket = io("http://localhost:5000");

// Join user room
socket.emit("join_user_room", { userId: "your-user-uuid" });

// Listen for job status updates
socket.on("job_status", (status) => {
  console.log("Job status:", status);
});

socket.on("job_accepted", (data) => {
  console.log("Job accepted by worker:", data);
});
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Redis Connection Issues

**Symptoms:**

```
❌ [REDIS_PUBLISH] Failed to broadcast job: ClientClosedError: The client is closed
```

**Solutions:**

- **Check Redis installation:**
  ```bash
  redis-cli ping
  # Should return: PONG
  ```
- **Start Redis server:**

  ```bash
  # Windows
  redis-server

  # Linux
  sudo systemctl start redis-server

  # Mac
  brew services start redis
  ```

- **Test Redis connection:**
  ```bash
  node test-redis.js
  ```
- **Check Redis configuration:**
  - Verify Redis is running on default port 6379
  - Check if Redis requires authentication
  - Ensure firewall allows Redis connections

#### 2. No Workers Found

**Symptoms:**

```
❌ [WORKER_SEARCH] No workers found for job uuid-here
```

**Solutions:**

- Check if workers exist in database
- Verify worker locations in `live_locations` table
- Test with larger radius: `?radius=20`
- Remove category filter: `?lat=12.9716&lng=77.5946&radius=10`

#### 3. Socket Connection Issues

**Symptoms:**

```
❌ [SOCKET_EMIT] Failed to notify worker uuid: Socket not connected
```

**Solutions:**

- Verify Socket.IO server is running
- Check CORS settings
- Ensure workers are connected to correct rooms
- Test socket connection manually

#### 4. Database Query Issues

**Symptoms:**

```
❌ [WORKER_SEARCH] Database error in getNearbyWorkers
```

**Solutions:**

- Check database connection
- Verify table schemas
- Test SQL query manually
- Check for missing indexes

### Debug Commands

#### Check Redis Status

```bash
redis-cli ping
redis-cli info clients
redis-cli monitor  # Watch Redis commands in real-time
```

#### Check System Health

```bash
curl http://localhost:5000/api/jobs/health
```

#### Check Database

```sql
-- Check workers with locations
SELECT w.id, w.firstName, w.lastName, ll.lat, ll.lng
FROM workers w
JOIN live_locations ll ON w.id = ll.workerId
LIMIT 5;

-- Check job status
SELECT id, status, workerId, createdAt
FROM jobs
ORDER BY createdAt DESC
LIMIT 5;
```

#### Monitor Socket Connections

```javascript
// In browser console or test client
console.log("Socket connected:", socket.connected);
console.log("Socket rooms:", socket.rooms);
```

## 📈 Performance Testing

### Load Testing

```bash
# Test multiple job creations
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/jobs \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"user-$i\",
      \"description\": \"Test job $i\",
      \"location\": \"Test Location $i\",
      \"lat\": 12.9716,
      \"lng\": 77.5946,
      \"bookedFor\": \"2024-01-15T14:00:00Z\",
      \"durationMinutes\": 60
    }" &
done
wait
```

### Monitor Performance

```bash
# Check metrics after load test
curl http://localhost:5000/api/jobs/broadcast-metrics
```

## 🎯 Expected Behavior

### Successful Flow

1. ✅ Job created in database
2. ✅ Job published to Redis
3. ✅ Redis subscriber receives message
4. ✅ Workers found within radius
5. ✅ Workers sorted by distance/experience
6. ✅ Socket.IO notifications sent
7. ✅ User notified of success
8. ✅ Metrics updated

### Error Handling

- ❌ Job creation fails → Return error to user
- ❌ Redis publish fails → Continue job creation
- ❌ No workers found → Notify user
- ❌ Socket emit fails → Log error, continue
- ❌ Database errors → Return 500 error

## 📝 Log Analysis

### Key Log Patterns to Monitor

```
✅ [JOB_CREATION] - Job created successfully
✅ [REDIS_PUBLISH] - Redis publish successful
✅ [SOCKET_EMIT] - Worker notified successfully
❌ [REDIS_PUBLISH] - Redis publish failed
❌ [SOCKET_EMIT] - Socket emit failed
📊 [METRICS] - Performance metrics
```

### Performance Indicators

- **Success Rate**: Should be > 95%
- **Average Workers per Job**: 1-10 workers
- **Response Time**: < 2 seconds for job creation
- **Broadcast Time**: < 1 second for worker notification

This testing guide helps you verify that the job broadcasting system is working correctly and efficiently.

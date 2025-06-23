# Socket Connection Troubleshooting Guide

## Common Socket Connection Issues and Solutions

### 1. **Backend Server Not Running**

**Symptoms:** `xhr poll error`, `ECONNREFUSED`, or connection timeout

**Solution:**

```bash
# Start the backend server
cd Backend
npm run dev

# Or use the startup script
node start-server.js
```

**Check if server is running:**

```bash
# Check if port 5000 is in use
netstat -an | grep :5000  # Linux/Mac
netstat -an | findstr :5000  # Windows
```

### 2. **Redis Not Running**

**Symptoms:** Redis connection errors in server logs

**Solution:**

```bash
# Install Redis if not installed
# Windows: Download from https://redis.io/download
# Mac: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis
redis-server  # Linux/Mac
# Windows: Start Redis service

# Test Redis connection
redis-cli ping  # Should return PONG
```

### 3. **CORS Issues**

**Symptoms:** CORS errors in browser console

**Solution:**

- Check that `FRONTEND_URL` environment variable is set correctly
- Ensure frontend is running on the expected port (usually 3000)
- Verify CORS configuration in `socket.server.ts`

### 4. **Port Conflicts**

**Symptoms:** Server won't start or connection refused

**Solution:**

```bash
# Check what's using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process if needed
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### 5. **Network/Firewall Issues**

**Symptoms:** Connection timeout or network errors

**Solution:**

- Check firewall settings
- Ensure no antivirus is blocking the connection
- Try using `localhost` instead of `127.0.0.1`

## Testing Steps

### Step 1: Test Backend Server

```bash
cd Backend
npm run dev
```

**Expected output:**

```
🚀 [SERVER] Starting server initialization...
🔌 [REDIS] Connecting to Redis...
✅ [REDIS] Successfully connected to Redis
✅ [SERVER] HTTP server created
🔌 [SOCKET] Initializing Socket.IO...
✅ [SOCKET] Socket.IO initialized
🎉 [SERVER] Server running at http://localhost:5000
```

### Step 2: Test Socket Connection

```bash
cd Backend
node test-socket-connection.js
```

**Expected output:**

```
🧪 Testing Socket.IO connection...
🔗 Connecting to: http://localhost:5000
✅ Socket connected successfully!
🆔 Socket ID: <socket-id>
📤 Test message sent
📨 Received test response: { message: 'Test response from server', ... }
```

### Step 3: Test Frontend Connection

1. Start frontend: `cd frontend && npm run dev`
2. Open browser console
3. Check for socket connection logs
4. Look for any error messages

## Environment Variables

Create a `.env` file in the Backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hack4bengal

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Debug Commands

### Check Redis Status

```bash
redis-cli ping
redis-cli info server
```

### Check Database Connection

```bash
cd Backend
node test-simple.js
```

### Monitor Socket Connections

```bash
# In browser console
socketManager.getConnectionStatus()
```

## Common Error Messages

| Error                     | Cause                      | Solution                   |
| ------------------------- | -------------------------- | -------------------------- |
| `xhr poll error`          | Backend server not running | Start backend server       |
| `CORS error`              | CORS configuration issue   | Check FRONTEND_URL env var |
| `Redis connection failed` | Redis not running          | Start Redis server         |
| `Connection timeout`      | Network/firewall issue     | Check network settings     |
| `ECONNREFUSED`            | Port not available         | Check if port 5000 is free |

## Getting Help

If you're still experiencing issues:

1. Check the server logs for detailed error messages
2. Run the test scripts to isolate the problem
3. Verify all services are running (PostgreSQL, Redis, Backend)
4. Check browser console for frontend errors
5. Ensure environment variables are set correctly

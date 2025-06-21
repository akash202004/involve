const { io } = require('socket.io-client');

// Test configuration
const SERVER_URL = 'http://localhost:5000';
const TEST_JOB_ID = 'test-job-123';
const TEST_WORKER_ID = 'test-worker-456';
const TEST_USER_ID = 'test-user-789';

console.log('🧪 Testing Live Location Tracking System');
console.log('========================================');

// Create worker socket connection
const workerSocket = io(SERVER_URL);

workerSocket.on('connect', () => {
    console.log('✅ Worker connected to server');

    // Simulate job acceptance
    console.log('🤝 Simulating job acceptance...');
    workerSocket.emit('accept_job', {
        jobId: TEST_JOB_ID,
        workerId: TEST_WORKER_ID
    });
});

// Listen for job acceptance confirmation
workerSocket.on('job_accepted_success', (data) => {
    console.log('✅ Job accepted successfully');
    console.log('📱 Tracking enabled:', data.trackingEnabled);

    // Start sending location updates
    console.log('📍 Starting location updates...');
    startLocationUpdates();
});

// Listen for location update confirmations
workerSocket.on('location_updated', (data) => {
    console.log('✅ Location updated:', data.timestamp);
});

// Listen for location errors
workerSocket.on('location_error', (data) => {
    console.error('❌ Location error:', data.message);
});

// Listen for job completion
workerSocket.on('job_completed_success', (data) => {
    console.log('✅ Job completed');
    console.log('📍 Tracking stopped:', data.trackingStopped);
    process.exit(0);
});

// Create user socket connection
const userSocket = io(SERVER_URL);

userSocket.on('connect', () => {
    console.log('✅ User connected to server');

    // Join user room
    userSocket.emit('join_user_room', { userId: TEST_USER_ID });
});

// Listen for job acceptance notification
userSocket.on('job_accepted', (data) => {
    console.log('✅ User notified of job acceptance');
    console.log('👷 Worker:', data.worker.firstName, data.worker.lastName);
    console.log('📍 Tracking enabled:', data.trackingEnabled);
});

// Listen for location updates
userSocket.on('worker_location_update', (data) => {
    console.log('📍 Worker location update:');
    console.log('   - Job ID:', data.jobId);
    console.log('   - Worker ID:', data.workerId);
    console.log('   - Location:', data.lat, data.lng);
    console.log('   - Timestamp:', data.timestamp);
});

// Listen for tracking stopped
userSocket.on('tracking_stopped', (data) => {
    console.log('📍 Tracking stopped:', data.message);
});

// Function to simulate location updates
function startLocationUpdates() {
    let updateCount = 0;

    const locationInterval = setInterval(() => {
        updateCount++;

        // Simulate movement (small random changes)
        const baseLat = 22.5726;
        const baseLng = 88.3639;
        const lat = baseLat + (Math.random() - 0.5) * 0.001;
        const lng = baseLng + (Math.random() - 0.5) * 0.001;

        console.log(`📍 Sending location update #${updateCount}:`, lat.toFixed(6), lng.toFixed(6));

        workerSocket.emit('update_location', {
            jobId: TEST_JOB_ID,
            workerId: TEST_WORKER_ID,
            lat,
            lng
        });

        // Stop after 5 updates and complete job
        if (updateCount >= 5) {
            clearInterval(locationInterval);

            console.log('✅ Completing job...');
            workerSocket.emit('complete_job', {
                jobId: TEST_JOB_ID,
                workerId: TEST_WORKER_ID
            });
        }
    }, 2000); // Update every 2 seconds
}

// Handle errors
workerSocket.on('connect_error', (error) => {
    console.error('❌ Worker connection error:', error.message);
});

userSocket.on('connect_error', (error) => {
    console.error('❌ User connection error:', error.message);
});

// Handle disconnection
workerSocket.on('disconnect', () => {
    console.log('🔌 Worker disconnected');
});

userSocket.on('disconnect', () => {
    console.log('🔌 User disconnected');
});

// Cleanup on exit
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down test...');
    workerSocket.disconnect();
    userSocket.disconnect();
    process.exit(0);
});

console.log('🚀 Test started. Press Ctrl+C to stop.'); 
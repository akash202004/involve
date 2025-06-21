const { io } = require('socket.io-client');

console.log('🧪 Simple Live Location Tracking Test');
console.log('=====================================');

// Test configuration
const SERVER_URL = 'http://localhost:5000';
const TEST_JOB_ID = 'test-job-123';
const TEST_WORKER_ID = 'test-worker-456';
const TEST_USER_ID = 'test-user-789';

// Create worker socket
const workerSocket = io(SERVER_URL);

workerSocket.on('connect', () => {
    console.log('✅ Worker connected to server');
    console.log('🔌 Socket ID:', workerSocket.id);

    // Simulate accepting a job
    console.log('🤝 Simulating job acceptance...');
    workerSocket.emit('accept_job', {
        jobId: TEST_JOB_ID,
        workerId: TEST_WORKER_ID
    });
});

// Listen for job acceptance
workerSocket.on('job_accepted_success', (data) => {
    console.log('✅ Job accepted successfully');
    console.log('📱 Tracking enabled:', data.trackingEnabled);

    // Start sending location updates
    console.log('📍 Starting location updates...');
    startLocationUpdates();
});

// Listen for location confirmations
workerSocket.on('location_updated', (data) => {
    console.log('✅ Location updated successfully:', data.timestamp);
});

// Listen for errors
workerSocket.on('location_error', (data) => {
    console.error('❌ Location error:', data.message);
});

workerSocket.on('job_error', (data) => {
    console.error('❌ Job error:', data.message);
});

// Create user socket
const userSocket = io(SERVER_URL);

userSocket.on('connect', () => {
    console.log('✅ User connected to server');
    console.log('🔌 Socket ID:', userSocket.id);

    // Join user room
    userSocket.emit('join_user_room', { userId: TEST_USER_ID });
});

// Listen for job acceptance notification
userSocket.on('job_accepted', (data) => {
    console.log('✅ User notified of job acceptance');
    console.log('👷 Worker info:', data.worker);
    console.log('📍 Tracking enabled:', data.trackingEnabled);
});

// Listen for location updates
userSocket.on('worker_location_update', (data) => {
    console.log('📍 Worker location update received:');
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

        // Simulate movement around Kolkata
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

            // Exit after a delay
            setTimeout(() => {
                console.log('🎉 Test completed successfully!');
                process.exit(0);
            }, 2000);
        }
    }, 2000); // Update every 2 seconds
}

// Handle connection errors
workerSocket.on('connect_error', (error) => {
    console.error('❌ Worker connection error:', error.message);
    console.log('💡 Make sure the server is running on', SERVER_URL);
});

userSocket.on('connect_error', (error) => {
    console.error('❌ User connection error:', error.message);
});

// Handle disconnections
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
console.log('📡 Connecting to server at:', SERVER_URL); 
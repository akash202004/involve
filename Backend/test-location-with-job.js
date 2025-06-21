const { io } = require('socket.io-client');
const axios = require('axios');

console.log('🧪 Live Location Tracking Test with Real Job');
console.log('============================================');

// Test configuration
const SERVER_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api/v1';

// Test data
const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000'; // Example UUID
const TEST_WORKER_ID = '550e8400-e29b-41d4-a716-446655440001'; // Example UUID

let createdJobId = null;

// Function to create a test job
async function createTestJob() {
    try {
        console.log('📝 Creating test job...');

        const jobData = {
            userId: TEST_USER_ID,
            description: 'Test plumbing job for location tracking',
            address: '123 Test Street, Kolkata',
            lat: 22.5726,
            lng: 88.3639,
            bookedFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            durationMinutes: 60
        };

        const response = await axios.post(`${API_URL}/jobs`, jobData);
        createdJobId = response.data.data.id;

        console.log('✅ Test job created with ID:', createdJobId);
        return createdJobId;
    } catch (error) {
        console.error('❌ Failed to create test job:', error.response?.data || error.message);
        throw error;
    }
}

// Function to run location tracking test
function runLocationTest(jobId) {
    console.log('📍 Starting location tracking test...');

    // Create worker socket
    const workerSocket = io(SERVER_URL);

    workerSocket.on('connect', () => {
        console.log('✅ Worker connected to server');
        console.log('🔌 Socket ID:', workerSocket.id);

        // Simulate accepting the job
        console.log('🤝 Simulating job acceptance...');
        workerSocket.emit('accept_job', {
            jobId: jobId,
            workerId: TEST_WORKER_ID
        });
    });

    // Listen for job acceptance
    workerSocket.on('job_accepted_success', (data) => {
        console.log('✅ Job accepted successfully');
        console.log('📱 Tracking enabled:', data.trackingEnabled);

        // Start sending location updates
        console.log('📍 Starting location updates...');
        startLocationUpdates(workerSocket, jobId);
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

    // Handle connection errors
    workerSocket.on('connect_error', (error) => {
        console.error('❌ Worker connection error:', error.message);
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
}

// Function to simulate location updates
function startLocationUpdates(workerSocket, jobId) {
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
            jobId: jobId,
            workerId: TEST_WORKER_ID,
            lat,
            lng
        });

        // Stop after 5 updates and complete job
        if (updateCount >= 5) {
            clearInterval(locationInterval);

            console.log('✅ Completing job...');
            workerSocket.emit('complete_job', {
                jobId: jobId,
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

// Main test execution
async function runTest() {
    try {
        // First create a test job
        const jobId = await createTestJob();

        // Then run the location tracking test
        runLocationTest(jobId);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

console.log('🚀 Starting test...');
console.log('📡 Connecting to server at:', SERVER_URL);
runTest(); 
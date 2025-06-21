const { io } = require('socket.io-client');
const axios = require('axios');

// Test configuration
const SERVER_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Live Location Tracking System (with real data)');
console.log('========================================================');

let testJobId, testWorkerId, testUserId;

// Function to create test data
async function createTestData() {
    try {
        console.log('📝 Creating test data...');

        // Create test user
        const userResponse = await axios.post(`${API_URL}/users`, {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            phoneNumber: '1234567890',
            password: 'password123',
            address: 'Test Address',
            city: 'Kolkata',
            state: 'West Bengal',
            country: 'India',
            zipCode: 700001,
            lat: 22.5726,
            lng: 88.3639
        });
        testUserId = userResponse.data.data.id;
        console.log('✅ Test user created:', testUserId);

        // Create test worker
        const workerResponse = await axios.post(`${API_URL}/workers`, {
            firstName: 'Test',
            lastName: 'Worker',
            email: 'testworker@example.com',
            password: 'password123',
            phoneNumber: '9876543210',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            experienceYears: 5,
            address: 'Worker Address',
            description: 'Test worker description'
        });
        testWorkerId = workerResponse.data.data.id;
        console.log('✅ Test worker created:', testWorkerId);

        // Create test job
        const jobResponse = await axios.post(`${API_URL}/jobs`, {
            userId: testUserId,
            description: 'Test job for location tracking',
            address: 'Job Location',
            lat: 22.5726,
            lng: 88.3639,
            status: 'pending',
            durationMinutes: 60
        });
        testJobId = jobResponse.data.data.id;
        console.log('✅ Test job created:', testJobId);

        return true;
    } catch (error) {
        console.error('❌ Failed to create test data:', error.response?.data || error.message);
        return false;
    }
}

// Function to clean up test data
async function cleanupTestData() {
    try {
        console.log('🧹 Cleaning up test data...');

        if (testJobId) {
            await axios.delete(`${API_URL}/jobs/${testJobId}`);
            console.log('✅ Test job deleted');
        }

        if (testWorkerId) {
            await axios.delete(`${API_URL}/workers/${testWorkerId}`);
            console.log('✅ Test worker deleted');
        }

        if (testUserId) {
            await axios.delete(`${API_URL}/users/${testUserId}`);
            console.log('✅ Test user deleted');
        }
    } catch (error) {
        console.error('❌ Failed to cleanup test data:', error.response?.data || error.message);
    }
}

// Main test function
async function runLocationTrackingTest() {
    // Create test data first
    const dataCreated = await createTestData();
    if (!dataCreated) {
        console.log('❌ Cannot proceed with test - failed to create test data');
        return;
    }

    console.log('\n🚀 Starting live location tracking test...');
    console.log('==========================================');

    // Create worker socket connection
    const workerSocket = io(SERVER_URL);

    workerSocket.on('connect', () => {
        console.log('✅ Worker connected to server');

        // Simulate job acceptance
        console.log('🤝 Simulating job acceptance...');
        workerSocket.emit('accept_job', {
            jobId: testJobId,
            workerId: testWorkerId
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

        // Cleanup and exit
        setTimeout(async () => {
            await cleanupTestData();
            process.exit(0);
        }, 1000);
    });

    // Create user socket connection
    const userSocket = io(SERVER_URL);

    userSocket.on('connect', () => {
        console.log('✅ User connected to server');

        // Join user room
        userSocket.emit('join_user_room', { userId: testUserId });
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
                jobId: testJobId,
                workerId: testWorkerId,
                lat,
                lng
            });

            // Stop after 5 updates and complete job
            if (updateCount >= 5) {
                clearInterval(locationInterval);

                console.log('✅ Completing job...');
                workerSocket.emit('complete_job', {
                    jobId: testJobId,
                    workerId: testWorkerId
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
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down test...');
        workerSocket.disconnect();
        userSocket.disconnect();
        await cleanupTestData();
        process.exit(0);
    });

    console.log('🚀 Test started. Press Ctrl+C to stop.');
}

// Run the test
runLocationTrackingTest().catch(async (error) => {
    console.error('❌ Test failed:', error);
    await cleanupTestData();
    process.exit(1);
}); 
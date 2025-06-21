const { io } = require('socket.io-client');
const axios = require('axios');

console.log('🧪 Complete Live Location Tracking Test');
console.log('=======================================');

// Test configuration
const SERVER_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api/v1';

let testUserId = null;
let testWorkerId = null;
let testJobId = null;

// Function to create test user
async function createTestUser() {
    try {
        console.log('👤 Creating test user...');

        const userData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            phoneNumber: '9876543210',
            password: 'testpass123',
            address: '123 Test Street, Kolkata',
            city: 'Kolkata',
            state: 'West Bengal',
            country: 'India',
            zipCode: 700001,
            lat: 22.5726,
            lng: 88.3639
        };

        const response = await axios.post(`${API_URL}/users`, userData);
        testUserId = response.data.data.id;

        console.log('✅ Test user created with ID:', testUserId);
        return testUserId;
    } catch (error) {
        console.error('❌ Failed to create test user:', error.response?.data || error.message);
        throw error;
    }
}

// Function to create test worker
async function createTestWorker() {
    try {
        console.log('👷 Creating test worker...');

        const workerData = {
            firstName: 'Test',
            lastName: 'Worker',
            email: 'testworker@example.com',
            password: 'testpass123',
            phoneNumber: '9876543211',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            experienceYears: 5,
            address: '456 Worker Street, Kolkata',
            description: 'Experienced plumber'
        };

        const response = await axios.post(`${API_URL}/workers`, workerData);
        testWorkerId = response.data.data.id;

        console.log('✅ Test worker created with ID:', testWorkerId);
        return testWorkerId;
    } catch (error) {
        console.error('❌ Failed to create test worker:', error.response?.data || error.message);
        throw error;
    }
}

// Function to create test job
async function createTestJob() {
    try {
        console.log('📝 Creating test job...');

        const jobData = {
            userId: testUserId,
            description: 'Test plumbing job for location tracking',
            address: '123 Test Street, Kolkata',
            lat: 22.5726,
            lng: 88.3639,
            bookedFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            durationMinutes: 60
        };

        const response = await axios.post(`${API_URL}/jobs`, jobData);
        testJobId = response.data.data.id;

        console.log('✅ Test job created with ID:', testJobId);
        return testJobId;
    } catch (error) {
        console.error('❌ Failed to create test job:', error.response?.data || error.message);
        throw error;
    }
}

// Function to run location tracking test
function runLocationTest() {
    console.log('📍 Starting location tracking test...');

    // Create worker socket
    const workerSocket = io(SERVER_URL);

    workerSocket.on('connect', () => {
        console.log('✅ Worker connected to server');
        console.log('🔌 Socket ID:', workerSocket.id);

        // Simulate accepting the job
        console.log('🤝 Simulating job acceptance...');
        workerSocket.emit('accept_job', {
            jobId: testJobId,
            workerId: testWorkerId
        });
    });

    // Listen for job acceptance
    workerSocket.on('job_accepted_success', (data) => {
        console.log('✅ Job accepted successfully');
        console.log('📱 Tracking enabled:', data.trackingEnabled);

        // Start sending location updates
        console.log('📍 Starting location updates...');
        startLocationUpdates(workerSocket);
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
        userSocket.emit('join_user_room', { userId: testUserId });
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
function startLocationUpdates(workerSocket) {
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
        // Create test data in sequence
        await createTestUser();
        await createTestWorker();
        await createTestJob();

        // Then run the location tracking test
        runLocationTest();

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

console.log('🚀 Starting complete test...');
console.log('📡 Connecting to server at:', SERVER_URL);
runTest(); 
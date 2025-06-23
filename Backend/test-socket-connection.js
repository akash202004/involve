const { io } = require('socket.io-client');

const SERVER_URL = process.env.BACKEND_URL || 'http://localhost:5000';

console.log('🧪 Testing Socket.IO connection...');
console.log('🔗 Connecting to:', SERVER_URL);

const socket = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    timeout: 10000,
    forceNew: true
});

// Connection events
socket.on('connect', () => {
    console.log('✅ Socket connected successfully!');
    console.log('🆔 Socket ID:', socket.id);

    // Test basic emit
    socket.emit('test_message', { message: 'Hello from test client!' });
    console.log('📤 Test message sent');
});

socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);

    if (error.message.includes('xhr poll error')) {
        console.log('💡 Make sure the backend server is running on port 5000');
    } else if (error.message.includes('timeout')) {
        console.log('💡 Connection timeout - check your network');
    } else if (error.message.includes('CORS')) {
        console.log('💡 CORS error - check server CORS configuration');
    }
});

socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
});

// Test response
socket.on('test_response', (data) => {
    console.log('📨 Received test response:', data);
});

// Cleanup after 5 seconds
setTimeout(() => {
    console.log('🧹 Cleaning up...');
    socket.disconnect();
    process.exit(0);
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted');
    socket.disconnect();
    process.exit(0);
}); 
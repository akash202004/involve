const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Backend Server...');

// Check if Redis is running
const redisCheck = spawn('redis-cli', ['ping'], { stdio: 'pipe' });

redisCheck.on('error', (error) => {
  console.log('⚠️  Redis might not be running. Please start Redis first:');
  console.log('   - Windows: Start Redis server');
  console.log('   - Mac/Linux: brew services start redis');
  console.log('   - Or install Redis if not installed');
});

redisCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Redis is running');
  } else {
    console.log('❌ Redis is not responding');
  }
});

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
}); 
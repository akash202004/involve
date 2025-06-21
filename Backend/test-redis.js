const { createClient } = require('redis');

async function testRedis() {
  console.log('🧪 Testing Redis connection...');
  
  const client = createClient();
  
  try {
    // Connect to Redis
    await client.connect();
    console.log('✅ Redis connection successful');
    
    // Test publish
    const testMessage = { test: 'message', timestamp: new Date().toISOString() };
    await client.publish('test-channel', JSON.stringify(testMessage));
    console.log('✅ Redis publish successful');
    
    // Test subscribe
    await client.subscribe('test-channel', (message) => {
      console.log('📨 Received message:', message);
    });
    console.log('✅ Redis subscribe successful');
    
    // Test publish to subscribed channel
    await client.publish('test-channel', JSON.stringify({ hello: 'world' }));
    
    // Wait a bit for message to be received
    setTimeout(async () => {
      await client.unsubscribe('test-channel');
      await client.disconnect();
      console.log('✅ Redis test completed successfully');
      process.exit(0);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Redis test failed:', error);
    process.exit(1);
  }
}

testRedis(); 
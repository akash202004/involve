#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envFilePath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('If you need to update your Civic client ID, please edit .env.local manually.');
  process.exit(0);
}

// Get the Civic client ID from command line argument or prompt
const clientId = process.argv[2];

if (!clientId) {
  console.log('❌ Error: Civic client ID is required.');
  console.log('Usage: node setup-env.js <your_civic_client_id>');
  console.log('');
  console.log('Example: node setup-env.js 8f217843-99ca-4206-ad02-b10adbe0c926');
  process.exit(1);
}

// Create the .env.local file
const envContent = `# Civic Authentication Configuration
CIVIC_CLIENT_ID=${clientId}

# Optional Civic OAuth Configuration (with defaults)
# CIVIC_OAUTH_SERVER=https://auth.civic.com
# CIVIC_CALLBACK_URL=http://localhost:3000/api/auth/civicauth/callback
# CIVIC_LOGIN_SUCCESS_URL=http://localhost:3000
# CIVIC_LOGIN_URL=http://localhost:3000/login
# CIVIC_LOGOUT_URL=http://localhost:3000/logout
# CIVIC_LOGOUT_CALLBACK_URL=http://localhost:3000/api/auth/civicauth/logout/callback
# CIVIC_REFRESH_URL=http://localhost:3000/api/auth/civicauth/refresh
# CIVIC_CHALLENGE_URL=http://localhost:3000/api/auth/civicauth/challenge
# CIVIC_INCLUDES=/
# CIVIC_EXCLUDES=/api/auth/**
# CIVIC_BASE_PATH=
`;

try {
  fs.writeFileSync(envFilePath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('🔒 Your Civic client ID has been securely stored.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('2. Your authentication should now work securely');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
} 
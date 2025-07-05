#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment for Emertrix Backend');
console.log('');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# MongoDB Connection (Railway)
# Replace this with your Railway MongoDB connection string
MONG_URI=mongodb://localhost:27017/emertrix

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
}

console.log('');
console.log('📋 Next steps:');
console.log('1. Get your Railway MongoDB connection string');
console.log('2. Update the MONG_URI in the .env file');
console.log('3. Run: npm run setup-db');
console.log('4. Run: npm run dev');
console.log('');
console.log('🔗 Railway MongoDB setup:');
console.log('- Go to your Railway dashboard');
console.log('- Find your MongoDB service');
console.log('- Copy the connection string');
console.log('- Replace the MONG_URI in .env file'); 
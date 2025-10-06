#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🌱 Starting Banquet Venues Seeding Process...\n');

// Run the enhanced seed script
const seedScript = path.join(__dirname, 'seedBanquetVenuesEnhanced.js');

exec(`node "${seedScript}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running seed script:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️  Warnings:', stderr);
  }
  
  console.log('✅ Seed script output:');
  console.log(stdout);
  
  console.log('\n🎉 Banquet venues seeding completed successfully!');
  console.log('\n📋 Summary of venues created:');
  console.log('1. Diamond Hall - Indoor • 500+ Guests - 750 sq. ft.');
  console.log('2. Emerald Hall - Indoor • 200 Guests - 8,000 sq. ft.');
  console.log('3. Ruby Hall - Indoor • 150 Guests - 4,500 sq. ft.');
  console.log('4. Topaz Hall - Indoor • 75 Guests - 6,000 sq. ft.');
  console.log('5. Silver Lawn - Outdoor • 250 Guests - 3,500 sq. ft.');
  console.log('6. Ashoka Lawn - Outdoor • 350 Guests - 4,500 sq. ft.');
  console.log('7. Crystal Lawn - Outdoor • 400+ Guests - 5,500 sq. ft.');
  
  console.log('\n🚀 You can now:');
  console.log('- Visit /admin/banquet-venues to manage venues');
  console.log('- Visit /resort/banquet-venues to view public page');
  console.log('- Check dashboard statistics for venue counts');
});

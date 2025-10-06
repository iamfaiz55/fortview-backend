# Awards Seeding Script

This directory contains scripts to seed the database with test awards data.

## Available Scripts

### TypeScript Version (Recommended)
```bash
npm run seed:awards
```

### JavaScript Version (Alternative)
```bash
node scripts/seedAwards.js
```

## What the Script Does

The seeding script will:

1. **Connect to MongoDB** using the connection string from your environment variables
2. **Clear existing awards** from the database (if any)
3. **Insert 12 test awards** with realistic data including:
   - Award titles and descriptions
   - Years from 2020-2024
   - Various organizations and categories
   - High-quality images from Unsplash
   - Proper ordering and active status

## Test Awards Included

The script creates awards in the following categories:
- Excellence in Service
- Environmental Excellence
- Customer Satisfaction
- Innovation Award
- Spa & Wellness
- Community Service
- Adventure Tourism
- Dining Excellence
- Wedding Services
- Leadership Award
- Family Services
- Quality Assurance

## Prerequisites

- MongoDB connection string must be set in your `.env` file as `MONGO_URL`
- All required dependencies must be installed (`npm install`)
- The Award model must be properly configured

## Usage

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the seeding script:
   ```bash
   npm run seed:awards
   ```

3. Check the console output for confirmation of successful seeding

## Notes

- The script uses high-quality stock images from Unsplash
- All awards are set to `isActive: true` by default
- Awards are ordered chronologically (newest first)
- The script will clear existing awards before inserting new ones

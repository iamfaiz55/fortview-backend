# Banquet Venues Seed Scripts

This directory contains scripts to populate the database with sample banquet venue data.

## Available Scripts

### 1. `seedBanquetVenues.js`
Basic seed script with sample venue data.

### 2. `seedBanquetVenuesEnhanced.js`
Enhanced seed script with more detailed venue information and better descriptions.

### 3. `runSeed.js`
Convenience script to run the enhanced seed script with better output formatting.

## How to Run

### Option 1: Run the enhanced seed script directly
```bash
cd server
node scripts/seedBanquetVenuesEnhanced.js
```

### Option 2: Use the convenience script
```bash
cd server
node scripts/runSeed.js
```

## Sample Venues Created

The seed script creates 7 banquet venues:

### Indoor Venues:
1. **Diamond Hall** - 500+ Guests, 750 sq. ft., Fully AC
2. **Emerald Hall** - 200 Guests, 8,000 sq. ft., Fully AC  
3. **Ruby Hall** - 150 Guests, 4,500 sq. ft., Fully AC
4. **Topaz Hall** - 75 Guests, 6,000 sq. ft., Non-AC

### Outdoor Venues:
5. **Silver Lawn** - 250 Guests, 3,500 sq. ft., Open Air
6. **Ashoka Lawn** - 350 Guests, 4,500 sq. ft., Open Air
7. **Crystal Lawn** - 400+ Guests, 5,500 sq. ft., Open Air

## Features Included

Each venue includes:
- ✅ Basic information (title, capacity, area, AC status)
- ✅ Detailed descriptions
- ✅ Multiple sample images (using Unsplash placeholders)
- ✅ Features array with amenities
- ✅ Pricing information with currency and includes
- ✅ Location details
- ✅ Active status and display order

## Notes

- The script uses placeholder images from Unsplash
- All venues are set to active by default
- Pricing is in INR currency
- Images are stored with placeholder URLs (replace with actual Cloudinary URLs in production)
- The script clears existing venues before inserting new ones

## After Running

Once the seed script completes:
1. Visit `/admin/banquet-venues` to manage the venues
2. Visit `/resort/banquet-venues` to see the public display
3. Check the admin dashboard for venue statistics
4. Test the CRUD operations in the admin panel

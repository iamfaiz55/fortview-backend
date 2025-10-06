const mongoose = require('mongoose');

// Define the schema inline since we can't easily import TypeScript models
const HomeGalleryItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  detailedDescription: String,
  category: String,
  capacity: String,
  area: String,
  features: [String],
  rating: Number,
  icon: String,
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const HomeGalleryItem = mongoose.model('HomeGalleryItem', HomeGalleryItemSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/your-database-name');

async function migrateFeaturesToArray() {
  try {
    console.log('Starting migration of features from JSON strings to arrays...');
    
    // Get all gallery items
    const items = await HomeGalleryItem.find({});
    console.log(`Found ${items.length} gallery items to process`);
    
    let updatedCount = 0;
    
    for (const item of items) {
      let needsUpdate = false;
      let newFeatures = [];
      
      if (Array.isArray(item.features)) {
        // Check if features are JSON strings that need parsing
        for (const feature of item.features) {
          if (typeof feature === 'string') {
            // Try to parse as JSON
            try {
              const parsed = JSON.parse(feature);
              if (Array.isArray(parsed)) {
                // It's a JSON array, add the parsed items
                newFeatures.push(...parsed);
                needsUpdate = true;
              } else {
                // It's a regular string, keep it
                newFeatures.push(feature);
              }
            } catch (e) {
              // Not JSON, treat as regular string
              newFeatures.push(feature);
            }
          } else {
            // Already a proper feature
            newFeatures.push(feature);
          }
        }
      }
      
      if (needsUpdate) {
        await HomeGalleryItem.findByIdAndUpdate(item._id, { features: newFeatures });
        console.log(`Updated item: ${item.title} - Features: ${newFeatures.join(', ')}`);
        updatedCount++;
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} items`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the migration
migrateFeaturesToArray();

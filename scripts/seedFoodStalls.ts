import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FoodStall from '../models/FoodStall';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/fortview-resort';

const testFoodStalls = [
  {
    title: "Spice Garden",
    description: "Authentic North Indian cuisine with traditional recipes and fresh ingredients",
    location: "Main Dining Hall",
    image: {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      publicId: "spice-garden"
    },
    isActive: true,
    order: 1
  },
  {
    title: "South Indian Corner",
    description: "Traditional South Indian delicacies including dosas, idlis, and sambhar",
    location: "Poolside Area",
    image: {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      publicId: "south-indian-corner"
    },
    isActive: true,
    order: 2
  },
  {
    title: "Street Food Hub",
    description: "Popular street food favorites including chaat, vada pav, and pani puri",
    location: "Garden Area",
    image: {
      url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
      publicId: "street-food-hub"
    },
    isActive: true,
    order: 3
  },
  {
    title: "Fresh Juice Bar",
    description: "Fresh fruit juices, smoothies, and healthy beverages made from seasonal fruits",
    location: "Reception Area",
    image: {
      url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
      publicId: "fresh-juice-bar"
    },
    isActive: true,
    order: 4
  },
  {
    title: "Dessert Delights",
    description: "Traditional Indian sweets and desserts including gulab jamun, rasgulla, and kheer",
    location: "Main Dining Hall",
    image: {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      publicId: "dessert-delights"
    },
    isActive: true,
    order: 5
  },
  {
    title: "Tandoor Special",
    description: "Fresh breads and grilled vegetables cooked in traditional clay tandoor oven",
    location: "Outdoor Dining",
    image: {
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      publicId: "tandoor-special"
    },
    isActive: true,
    order: 6
  },
  {
    title: "Healthy Bites",
    description: "Nutritious salads, soups, and light meals for health-conscious guests",
    location: "Spa Area",
    image: {
      url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop",
      publicId: "healthy-bites"
    },
    isActive: true,
    order: 7
  },
  {
    title: "Coffee Corner",
    description: "Premium coffee, tea, and light snacks in a cozy atmosphere",
    location: "Lobby",
    image: {
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      publicId: "coffee-corner"
    },
    isActive: true,
    order: 8
  }
];

async function seedFoodStalls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing food stalls
    await FoodStall.deleteMany({});
    console.log('Cleared existing food stalls');

    // Insert test food stalls
    const createdStalls = await FoodStall.insertMany(testFoodStalls);
    console.log(`Successfully created ${createdStalls.length} food stalls`);

    // Display created stalls
    console.log('\nCreated food stalls:');
    createdStalls.forEach((stall, index) => {
      console.log(`${index + 1}. ${stall.title} - ${stall.location}`);
    });

  } catch (error) {
    console.error('Error seeding food stalls:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedFoodStalls();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/fortview-resort';

const testFoods = [
  {
    name: "Dal Makhani",
    description: "Creamy black lentils cooked with butter, cream and aromatic spices",
    category: "Main Course",
    image: {
      url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      publicId: "dal-makhani"
    },
    isActive: true,
    order: 1
  },
  {
    name: "Paneer Butter Masala",
    description: "Soft cottage cheese in rich tomato and cream gravy with aromatic spices",
    category: "Main Course",
    image: {
      url: "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop",
      publicId: "paneer-butter-masala"
    },
    isActive: true,
    order: 2
  },
  {
    name: "Jeera Rice",
    description: "Fragrant basmati rice tempered with cumin seeds and ghee",
    category: "Rice & Dal",
    image: {
      url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
      publicId: "jeera-rice"
    },
    isActive: true,
    order: 3
  },
  {
    name: "Chana Masala",
    description: "Spiced chickpeas cooked with onions, tomatoes and aromatic spices",
    category: "Main Course",
    image: {
      url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      publicId: "chana-masala"
    },
    isActive: true,
    order: 4
  },
  {
    name: "Aloo Gobi",
    description: "Potato and cauliflower curry with traditional Indian spices",
    category: "Main Course",
    image: {
      url: "https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop",
      publicId: "aloo-gobi"
    },
    isActive: true,
    order: 5
  },
  {
    name: "Raita",
    description: "Fresh yogurt with cucumber, tomatoes and mint",
    category: "Salads",
    image: {
      url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop",
      publicId: "raita"
    },
    isActive: true,
    order: 6
  },
  {
    name: "Samosa",
    description: "Crispy fried pastry filled with spiced potatoes and peas",
    category: "Snacks",
    image: {
      url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      publicId: "samosa"
    },
    isActive: true,
    order: 7
  },
  {
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
    category: "Desserts",
    image: {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      publicId: "gulab-jamun"
    },
    isActive: true,
    order: 8
  },
  {
    name: "Lassi",
    description: "Refreshing yogurt drink with cardamom and rose water",
    category: "Beverages",
    image: {
      url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      publicId: "lassi"
    },
    isActive: true,
    order: 9
  },
  {
    name: "Naan",
    description: "Soft leavened bread baked in tandoor oven",
    category: "Bread",
    image: {
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      publicId: "naan"
    },
    isActive: true,
    order: 10
  },
  {
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice with mixed vegetables and aromatic spices",
    category: "Main Course",
    image: {
      url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      publicId: "vegetable-biryani"
    },
    isActive: true,
    order: 11
  },
  {
    name: "Mango Lassi",
    description: "Sweet mango and yogurt smoothie with cardamom",
    category: "Beverages",
    image: {
      url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      publicId: "mango-lassi"
    },
    isActive: true,
    order: 12
  }
];

async function seedFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing foods
    await Food.deleteMany({});
    console.log('Cleared existing foods');

    // Insert test foods
    const createdFoods = await Food.insertMany(testFoods);
    console.log(`Successfully created ${createdFoods.length} food items`);

    // Display created foods
    console.log('\nCreated foods:');
    createdFoods.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name} - ${food.category}`);
    });

  } catch (error) {
    console.error('Error seeding foods:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedFoods();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// SelfiePoint Schema
const SelfiePointSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  image: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const SelfiePoint = mongoose.model('SelfiePoint', SelfiePointSchema);

// Default selfie points data
const defaultSelfiePoints = [
  {
    title: "Resort Entrance Welcome Sign",
    description: "Capture your arrival moment at our beautiful resort entrance with the iconic welcome sign. Perfect for your first memory of the stay.",
    image: {
      url: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Resort+Entrance",
      publicId: "fortview/selfie-points/entrance-placeholder"
    },
    isActive: true,
    order: 1
  },
  {
    title: "Luxury Poolside",
    description: "Strike a pose by our crystal-clear infinity pool with stunning mountain views in the background. The perfect spot for your vacation photos.",
    image: {
      url: "https://via.placeholder.com/800x600/06B6D4/FFFFFF?text=Poolside+View",
      publicId: "fortview/selfie-points/pool-placeholder"
    },
    isActive: true,
    order: 2
  },
  {
    title: "Garden Gazebo",
    description: "Surrounded by lush greenery and colorful flowers, our garden gazebo offers a romantic backdrop for your memorable moments.",
    image: {
      url: "https://via.placeholder.com/800x600/10B981/FFFFFF?text=Garden+Gazebo",
      publicId: "fortview/selfie-points/gazebo-placeholder"
    },
    isActive: true,
    order: 3
  },
  {
    title: "Mountain View Deck",
    description: "Take in the breathtaking panoramic mountain views from our elevated deck. A must-capture spot for nature lovers.",
    image: {
      url: "https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Mountain+View",
      publicId: "fortview/selfie-points/mountain-placeholder"
    },
    isActive: true,
    order: 4
  },
  {
    title: "Spa & Wellness Center",
    description: "Relax and rejuvenate in our tranquil spa area. Capture your zen moment in this peaceful sanctuary.",
    image: {
      url: "https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Spa+Wellness",
      publicId: "fortview/selfie-points/spa-placeholder"
    },
    isActive: true,
    order: 5
  },
  {
    title: "Adventure Zone Entrance",
    description: "Ready for some excitement? Capture your adventurous spirit at our adventure zone entrance before the fun begins.",
    image: {
      url: "https://via.placeholder.com/800x600/EF4444/FFFFFF?text=Adventure+Zone",
      publicId: "fortview/selfie-points/adventure-placeholder"
    },
    isActive: true,
    order: 6
  },
  {
    title: "Fine Dining Restaurant",
    description: "Elegant dining experience awaits. Capture the sophisticated ambiance of our fine dining restaurant.",
    image: {
      url: "https://via.placeholder.com/800x600/6B7280/FFFFFF?text=Fine+Dining",
      publicId: "fortview/selfie-points/dining-placeholder"
    },
    isActive: true,
    order: 7
  },
  {
    title: "Sunset Point",
    description: "Witness magical sunsets from our exclusive sunset point. The golden hour creates perfect lighting for your photos.",
    image: {
      url: "https://via.placeholder.com/800x600/F97316/FFFFFF?text=Sunset+Point",
      publicId: "fortview/selfie-points/sunset-placeholder"
    },
    isActive: true,
    order: 8
  }
];

async function seedSelfiePoints() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing selfie points
    await SelfiePoint.deleteMany({});
    console.log('Cleared existing selfie points');

    // Insert default selfie points
    const createdSelfiePoints = await SelfiePoint.insertMany(defaultSelfiePoints);
    console.log(`Successfully created ${createdSelfiePoints.length} selfie points`);

    // Display created selfie points
    createdSelfiePoints.forEach((point, index) => {
      console.log(`${index + 1}. ${point.title} - ${point.description.substring(0, 50)}...`);
    });

    console.log('\nSelfie points seeding completed successfully!');
    console.log('You can now update the images through the admin panel.');

  } catch (error) {
    console.error('Error seeding selfie points:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedSelfiePoints();

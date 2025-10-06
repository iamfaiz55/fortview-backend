const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define the schema inline since we can't import TypeScript
const AdventureActivitySchema = new mongoose.Schema({
  name: {
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
  detailedDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['indoor', 'outdoor', 'water', 'kids']
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
  icon: {
    type: String,
    required: true,
    trim: true
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['kids', 'teens-adults', 'kids-adults', 'all-ages']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'moderate', 'hard']
  },
  timing: {
    type: String,
    required: true,
    enum: ['all-day', 'morning-evening', 'evening']
  },
  duration: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  capacity: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  highlights: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  equipment: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  safetyRequirements: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  weatherDependent: {
    type: Boolean,
    default: false
  },
  minAge: {
    type: Number,
    min: 0,
    max: 100
  },
  maxAge: {
    type: Number,
    min: 0,
    max: 100
  },
  price: {
    adult: {
      type: Number,
      min: 0
    },
    child: {
      type: Number,
      min: 0
    },
    group: {
      type: Number,
      min: 0
    }
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  instructorRequired: {
    type: Boolean,
    default: false
  },
  groupSize: {
    min: {
      type: Number,
      min: 1
    },
    max: {
      type: Number,
      min: 1
    }
  }
}, {
  timestamps: true
});

const AdventureActivity = mongoose.model('AdventureActivity', AdventureActivitySchema);

const adventureActivitiesData = [
  // Indoor Games
  {
    name: "Pool/Billiards",
    description: "Classic 8-ball and 9-ball pool games in our professionally maintained billiards room",
    detailedDescription: "Experience the thrill of professional billiards in our state-of-the-art billiards room. Our tables are maintained to tournament standards, providing the perfect environment for both casual games and competitive matches. Whether you're a beginner or an experienced player, our friendly staff can provide guidance and tips to improve your game.",
    category: "indoor",
    image: {
      url: "https://images.unsplash.com/photo-1694887916265-067cc5eb0a6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWxsaWFyZHMlMjBwb29sJTIwdGFibGUlMjBpbmRvb3J8ZW58MXx8fHwxNzU3NDMyMjcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/pool-billiards"
    },
    icon: "Gamepad2",
    ageGroup: "teens-adults",
    difficulty: "easy",
    timing: "all-day",
    duration: "30-60 mins",
    capacity: "2-4 players",
    highlights: ["Professional tables", "All equipment included", "Tournament style"],
    rating: 4.5,
    isActive: true,
    order: 1,
    equipment: ["Pool cues", "Chalk", "Triangle rack", "Cue ball"],
    safetyRequirements: ["Proper cue handling", "No running around tables"],
    weatherDependent: false,
    minAge: 12,
    maxAge: 80,
    price: {
      adult: 15,
      child: 10,
      group: 50
    },
    location: "Indoor Games Room",
    instructorRequired: false,
    groupSize: {
      min: 1,
      max: 4
    }
  },
  {
    name: "Table Tennis",
    description: "Fast-paced ping pong matches with high-quality tables and professional equipment",
    detailedDescription: "Challenge your friends and family to exciting table tennis matches in our dedicated ping pong area. Our Olympic-standard tables and professional paddles ensure the best playing experience. Perfect for improving hand-eye coordination and having fun with competitive matches.",
    category: "indoor",
    image: {
      url: "https://images.unsplash.com/photo-1705087917495-8530cbaa858e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHRlbm5pcyUyMHBpbmclMjBwb25nJTIwaW5kb29yfGVufDF8fHx8MTc1NzQzMjI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/table-tennis"
    },
    icon: "Circle",
    ageGroup: "all-ages",
    difficulty: "easy",
    timing: "all-day",
    duration: "20-45 mins",
    capacity: "2-4 players",
    highlights: ["Olympic standard tables", "Coaching available", "Family friendly"],
    rating: 4.7,
    isActive: true,
    order: 2,
    equipment: ["Table tennis paddles", "Balls", "Net", "Scoreboard"],
    safetyRequirements: ["Proper paddle grip", "No swinging paddles"],
    weatherDependent: false,
    minAge: 5,
    maxAge: 80,
    price: {
      adult: 10,
      child: 8,
      group: 35
    },
    location: "Indoor Games Room",
    instructorRequired: false,
    groupSize: {
      min: 1,
      max: 4
    }
  },
  {
    name: "Mountain Trekking",
    description: "Guided nature treks through scenic mountain trails with breathtaking valley views",
    detailedDescription: "Embark on an unforgettable journey through pristine mountain trails with our experienced guides. Discover hidden waterfalls, panoramic viewpoints, and diverse wildlife while learning about local flora and fauna. Our treks are designed for all fitness levels with multiple difficulty options.",
    category: "outdoor",
    image: {
      url: "https://images.unsplash.com/photo-1615472767332-e5615c7e617a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGlraW5nJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc1NzQzMjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/mountain-trekking"
    },
    icon: "Mountain",
    ageGroup: "teens-adults",
    difficulty: "moderate",
    timing: "morning-evening",
    duration: "2-4 hours",
    capacity: "6-15 people",
    highlights: ["Expert guides", "Safety equipment", "Stunning views"],
    rating: 4.9,
    isActive: true,
    order: 3,
    equipment: ["Trekking poles", "Backpack", "Water bottles", "First aid kit"],
    safetyRequirements: ["Proper hiking boots", "Weather-appropriate clothing", "Physical fitness check"],
    weatherDependent: true,
    minAge: 12,
    maxAge: 65,
    price: {
      adult: 45,
      child: 35,
      group: 200
    },
    location: "Mountain Trail & Adventure Zone",
    instructorRequired: true,
    groupSize: {
      min: 4,
      max: 15
    }
  },
  {
    name: "Swimming Pool",
    description: "Olympic-sized swimming pool with separate kids area, perfect for relaxation and fitness",
    detailedDescription: "Dive into our crystal-clear Olympic-sized swimming pool designed for both recreation and fitness. With separate shallow areas for children and deep sections for serious swimmers, our pool offers something for everyone. Enjoy poolside service, comfortable lounging areas, and professional lifeguard supervision.",
    category: "water",
    image: {
      url: "https://images.unsplash.com/photo-1560850006-5837212e620b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzU3NDMyMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/swimming-pool"
    },
    icon: "Waves",
    ageGroup: "all-ages",
    difficulty: "easy",
    timing: "all-day",
    duration: "Unlimited",
    capacity: "50+ people",
    highlights: ["Heated pool", "Lifeguard on duty", "Pool bar"],
    rating: 4.8,
    isActive: true,
    order: 4,
    equipment: ["Pool noodles", "Floatation devices", "Towels", "Pool toys"],
    safetyRequirements: ["Swimming ability check", "Shower before entering", "No running"],
    weatherDependent: false,
    minAge: 3,
    maxAge: 80,
    price: {
      adult: 20,
      child: 15,
      group: 100
    },
    location: "Resort Swimming Pool Area",
    instructorRequired: false,
    groupSize: {
      min: 1,
      max: 50
    }
  },
  {
    name: "Soft Play Area",
    description: "Safe indoor play area with soft foam structures, perfect for toddlers and young children",
    detailedDescription: "Our specially designed soft play area provides a safe and fun environment for toddlers and young children to explore, climb, and play. With colorful foam structures, slides, and interactive elements, children can develop their motor skills while having endless fun in a completely safe environment.",
    category: "kids",
    image: {
      url: "https://images.unsplash.com/photo-1716558833641-0a2ac4bc6849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGxheWdyb3VuZCUyMHNvZnQlMjBwbGF5fGVufDF8fHx8MTc1NzQzMjI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/soft-play-area"
    },
    icon: "Baby",
    ageGroup: "kids",
    difficulty: "easy",
    timing: "all-day",
    duration: "Unlimited",
    capacity: "15-20 kids",
    highlights: ["Age-appropriate", "Parent supervision area", "Safety certified"],
    rating: 4.8,
    isActive: true,
    order: 5,
    equipment: ["Soft foam blocks", "Small slides", "Interactive toys", "Safety mats"],
    safetyRequirements: ["Adult supervision required", "Socks only", "No food or drinks"],
    weatherDependent: false,
    minAge: 1,
    maxAge: 8,
    price: {
      adult: 0,
      child: 15,
      group: 50
    },
    location: "Kids Zone - Soft Play Area",
    instructorRequired: false,
    groupSize: {
      min: 1,
      max: 20
    }
  },
  {
    name: "Bullock Cart Ride",
    description: "Experience a traditional countryside ride on a bullock cart around the resort",
    detailedDescription: "Take a nostalgic journey through the resort grounds on a traditional bullock cart. This slow-paced, family-friendly activity offers a glimpse into rural life while enjoying scenic views and fresh air. Perfect for photos and a relaxing cultural experience.",
    category: "outdoor",
    image: {
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1080&auto=format&fit=crop",
      publicId: "adventure-activities/bullock-cart"
    },
    icon: "Car",
    ageGroup: "all-ages",
    difficulty: "easy",
    timing: "morning-evening",
    duration: "10-20 mins",
    capacity: "2-4 people",
    highlights: ["Traditional experience", "Great for families", "Scenic route"],
    rating: 4.6,
    isActive: true,
    order: 6,
    equipment: ["Comfortable seating"],
    safetyRequirements: ["Follow attendant instructions", "Remain seated during ride"],
    weatherDependent: true,
    minAge: 0,
    maxAge: 80,
    price: { adult: 10, child: 7, group: 30 },
    location: "Resort Grounds - Cultural Zone",
    instructorRequired: false,
    groupSize: { min: 1, max: 4 }
  },
  {
    name: "Camel Ride",
    description: "Gentle camel ride with handler along a designated scenic route",
    detailedDescription: "Enjoy a gentle camel ride guided by an experienced handler. This unique experience is perfect for guests of all ages and offers a wonderful photo opportunity. Safety equipment and mounting assistance provided.",
    category: "outdoor",
    image: {
      url: "https://images.unsplash.com/photo-1504553101389-40e3a60b1ca9?q=80&w=1080&auto=format&fit=crop",
      publicId: "adventure-activities/camel-ride"
    },
    icon: "Flag",
    ageGroup: "kids-adults",
    difficulty: "easy",
    timing: "morning-evening",
    duration: "5-15 mins",
    capacity: "1-2 people",
    highlights: ["Guided ride", "Photo-friendly", "Cultural experience"],
    rating: 4.7,
    isActive: true,
    order: 7,
    equipment: ["Mounting stool"],
    safetyRequirements: ["Handler guidance required", "Wear suitable footwear"],
    weatherDependent: true,
    minAge: 3,
    maxAge: 70,
    price: { adult: 12, child: 8, group: 40 },
    location: "Resort Grounds - Safari Track",
    instructorRequired: true,
    groupSize: { min: 1, max: 2 }
  }
];

// Function to seed the database
const seedAdventureActivities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing adventure activities
    await AdventureActivity.deleteMany({});
    console.log('Cleared existing adventure activities');

    // Insert new adventure activities
    const createdActivities = await AdventureActivity.insertMany(adventureActivitiesData);
    console.log(`Successfully created ${createdActivities.length} adventure activities`);

    // Log created activities
    createdActivities.forEach(activity => {
      console.log(`- ${activity.name} (${activity.category})`);
    });

    console.log('Adventure activities seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding adventure activities:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
if (require.main === module) {
  seedAdventureActivities();
}

module.exports = { seedAdventureActivities, adventureActivitiesData };


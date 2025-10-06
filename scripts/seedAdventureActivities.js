const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the AdventureActivity model
const AdventureActivity = require('../models/AdventureActivity');

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

  // Outdoor Games
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
    name: "Zipline Adventure",
    description: "Soar through the canopy on our thrilling zipline course with multiple platforms",
    detailedDescription: "Experience the ultimate adrenaline rush as you zip through the forest canopy on our professionally designed zipline course. With multiple platforms and varying heights, this adventure offers breathtaking views and heart-pounding excitement. Our certified instructors ensure your safety while you enjoy the ride of a lifetime.",
    category: "outdoor",
    image: {
      url: "https://images.unsplash.com/photo-1550310349-1ddd397b3ff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6aXBsaW5lJTIwYWR2ZW50dXJlJTIwZm9yZXN0fGVufDF8fHx8MTc1NzM2NTE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/zipline-adventure"
    },
    icon: "Zap",
    ageGroup: "teens-adults",
    difficulty: "moderate",
    timing: "morning-evening",
    duration: "45-90 mins",
    capacity: "1-8 people",
    highlights: ["500m course", "Safety certified", "Photo service"],
    rating: 4.8,
    isActive: true,
    order: 4,
    equipment: ["Harness", "Helmet", "Gloves", "Pulley system"],
    safetyRequirements: ["Weight limit 45-100kg", "Height minimum 140cm", "No medical conditions"],
    weatherDependent: true,
    minAge: 12,
    maxAge: 60,
    price: {
      adult: 65,
      child: 50,
      group: 300
    },
    location: "Adventure Zone - Zipline Course",
    instructorRequired: true,
    groupSize: {
      min: 1,
      max: 8
    }
  },
  {
    name: "Obstacle Course",
    description: "Challenge yourself on our multi-level obstacle course with rope climbs and balance beams",
    detailedDescription: "Test your physical and mental strength on our challenging obstacle course designed for team building and personal achievement. Navigate through rope climbs, balance beams, wall climbs, and various other obstacles that will push your limits while having fun in a safe environment.",
    category: "outdoor",
    image: {
      url: "https://images.unsplash.com/photo-1734445559604-ae06dec16520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYnN0YWNsZSUyMGNvdXJzZSUyMG91dGRvb3IlMjBhZHZlbnR1cmV8ZW58MXx8fHx8MTc1NzQzMjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/obstacle-course"
    },
    icon: "Target",
    ageGroup: "kids-adults",
    difficulty: "moderate",
    timing: "morning-evening",
    duration: "30-60 mins",
    capacity: "4-12 people",
    highlights: ["Team building", "Different difficulty levels", "Timing challenges"],
    rating: 4.6,
    isActive: true,
    order: 5,
    equipment: ["Safety harness", "Helmet", "Gloves", "Timing equipment"],
    safetyRequirements: ["Physical fitness check", "Proper clothing", "No loose jewelry"],
    weatherDependent: true,
    minAge: 8,
    maxAge: 50,
    price: {
      adult: 35,
      child: 25,
      group: 150
    },
    location: "Adventure Zone - Obstacle Course",
    instructorRequired: true,
    groupSize: {
      min: 2,
      max: 12
    }
  },

  // Water Activities
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
    order: 6,
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
    name: "Water Zorbing",
    description: "Roll and bounce inside giant transparent water balls for an unforgettable experience",
    detailedDescription: "Experience the unique thrill of water zorbing as you roll and bounce inside giant transparent balls filled with water. This one-of-a-kind activity provides endless fun and laughter while being completely safe. Perfect for groups and families looking for something different and exciting.",
    category: "water",
    image: {
      url: "https://images.unsplash.com/photo-1681161497001-e7fa23711e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjByZXNvcnQlMjB3YXRlciUyMGFjdGl2aXRpZXMlMjB6aXBsaW5lfGVufDF8fHx8MTc1NzQzMjAxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/water-zorbing"
    },
    icon: "Droplets",
    ageGroup: "kids-adults",
    difficulty: "easy",
    timing: "morning-evening",
    duration: "15-30 mins",
    capacity: "1-2 people",
    highlights: ["Unique experience", "Safe water landing", "Photo opportunities"],
    rating: 4.7,
    isActive: true,
    order: 7,
    equipment: ["Water zorb balls", "Safety harness", "Water supply system"],
    safetyRequirements: ["Weight limit 40-100kg", "Swimming ability", "No medical conditions"],
    weatherDependent: true,
    minAge: 8,
    maxAge: 60,
    price: {
      adult: 25,
      child: 20,
      group: 80
    },
    location: "Water Activities Area",
    instructorRequired: true,
    groupSize: {
      min: 1,
      max: 2
    }
  },
  {
    name: "Rain Dance",
    description: "Dance under artificial rain with music and lights for a refreshing party experience",
    detailedDescription: "Let loose and dance under our artificial rain system with vibrant music and colorful lights. This unique party experience combines the joy of dancing with the refreshing feeling of rain, creating an unforgettable celebration atmosphere. Perfect for groups, parties, and special events.",
    category: "water",
    image: {
      url: "https://images.unsplash.com/photo-1560850006-5837212e620b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzU3NDMyMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/rain-dance"
    },
    icon: "CloudRain",
    ageGroup: "all-ages",
    difficulty: "easy",
    timing: "evening",
    duration: "45-90 mins",
    capacity: "20-50 people",
    highlights: ["Live DJ", "Light effects", "Group activity"],
    rating: 4.9,
    isActive: true,
    order: 8,
    equipment: ["Sound system", "Rain system", "Lighting effects", "Towels"],
    safetyRequirements: ["Non-slip footwear", "Waterproof clothing", "No electronic devices"],
    weatherDependent: false,
    minAge: 5,
    maxAge: 70,
    price: {
      adult: 30,
      child: 20,
      group: 200
    },
    location: "Water Activities Area - Rain Dance Zone",
    instructorRequired: false,
    groupSize: {
      min: 10,
      max: 50
    }
  },

  // Kids Zones
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
    order: 9,
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
    name: "Swing & Slides",
    description: "Colorful outdoor playground with swings, slides, and climbing frames for active play",
    detailedDescription: "Let your children enjoy hours of fun in our vibrant outdoor playground featuring swings, slides, climbing frames, and various play equipment. Designed with safety in mind, our playground offers different areas for various age groups, ensuring every child can play safely while developing their physical and social skills.",
    category: "kids",
    image: {
      url: "https://images.unsplash.com/photo-1746010531584-b3a67fc697c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN3aW5nJTIwc2xpZGUlMjBwbGF5Z3JvdW5kfGVufDF8fHx8MTc1NzQzMjI3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publicId: "adventure-activities/swing-slides"
    },
    icon: "PlayCircle",
    ageGroup: "kids",
    difficulty: "easy",
    timing: "all-day",
    duration: "Unlimited",
    capacity: "20-30 kids",
    highlights: ["Multiple age groups", "Shaded areas", "Safety surfacing"],
    rating: 4.7,
    isActive: true,
    order: 10,
    equipment: ["Swings", "Slides", "Climbing frames", "Sandbox", "Safety mats"],
    safetyRequirements: ["Adult supervision required", "Proper footwear", "No running on equipment"],
    weatherDependent: true,
    minAge: 2,
    maxAge: 12,
    price: {
      adult: 0,
      child: 10,
      group: 40
    },
    location: "Kids Zone - Outdoor Playground",
    instructorRequired: false,
    groupSize: {
      min: 1,
      max: 30
    }
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
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event';

// Load environment variables
dotenv.config();

// Test events data
const testEvents = [
  {
    title: "Summer Wedding Celebration",
    description: "A magical outdoor wedding ceremony with breathtaking views and elegant decorations. Perfect for couples looking for a romantic and memorable day.",
    date: "2024-06-15",
    time: "16:00",
    location: "Garden Pavilion",
    category: "Wedding",
    price: 150000,
    capacity: 200,
    image: {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&crop=center",
      publicId: "event-summer-wedding-2024"
    },
    isActive: true,
    order: 1
  },
  {
    title: "Corporate Team Building Retreat",
    description: "Enhance team collaboration with our exciting outdoor activities, team challenges, and professional development sessions in a natural setting.",
    date: "2024-07-20",
    time: "09:00",
    location: "Conference Hall & Outdoor Arena",
    category: "Corporate",
    price: 75000,
    capacity: 50,
    image: {
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&crop=center",
      publicId: "event-corporate-retreat-2024"
    },
    isActive: true,
    order: 2
  },
  {
    title: "Children's Birthday Party",
    description: "Fun-filled birthday celebration with games, activities, and entertainment for kids. Includes themed decorations and party favors.",
    date: "2024-08-10",
    time: "14:00",
    location: "Kids Play Area",
    category: "Birthday",
    price: 25000,
    capacity: 30,
    image: {
      url: "https://images.unsplash.com/photo-1530103868436-7e3d8d3d3b0a?w=800&h=600&fit=crop&crop=center",
      publicId: "event-kids-birthday-2024"
    },
    isActive: true,
    order: 3
  },
  {
    title: "School Educational Trip",
    description: "Educational and fun day trip for students featuring nature walks, environmental learning, and adventure activities.",
    date: "2024-09-05",
    time: "10:00",
    location: "Nature Trail & Adventure Zone",
    category: "Educational",
    price: 15000,
    capacity: 100,
    image: {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&crop=center",
      publicId: "event-school-trip-2024"
    },
    isActive: true,
    order: 4
  },
  {
    title: "Anniversary Celebration",
    description: "Celebrate your special milestone with an intimate dinner, live music, and personalized service in our elegant dining area.",
    date: "2024-10-12",
    time: "19:00",
    location: "Fine Dining Restaurant",
    category: "Anniversary",
    price: 45000,
    capacity: 40,
    image: {
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      publicId: "event-anniversary-2024"
    },
    isActive: true,
    order: 5
  },
  {
    title: "Festival Celebration",
    description: "Join us for traditional festival celebrations with cultural performances, traditional food, and festive decorations.",
    date: "2024-11-15",
    time: "18:00",
    location: "Main Event Hall",
    category: "Festival",
    price: 35000,
    capacity: 150,
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      publicId: "event-festival-2024"
    },
    isActive: true,
    order: 6
  },
  {
    title: "New Year's Eve Gala",
    description: "Ring in the new year with style! Enjoy a grand celebration with live music, gourmet dinner, and spectacular fireworks display.",
    date: "2024-12-31",
    time: "20:00",
    location: "Grand Ballroom",
    category: "New Year",
    price: 200000,
    capacity: 300,
    image: {
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=center",
      publicId: "event-new-year-2024"
    },
    isActive: true,
    order: 7
  },
  {
    title: "Wellness Retreat Weekend",
    description: "Rejuvenate your mind and body with yoga sessions, spa treatments, meditation, and healthy gourmet meals in a peaceful environment.",
    date: "2025-01-18",
    time: "08:00",
    location: "Spa & Wellness Center",
    category: "Wellness",
    price: 85000,
    capacity: 25,
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
      publicId: "event-wellness-retreat-2025"
    },
    isActive: true,
    order: 8
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert test events
    const createdEvents = await Event.insertMany(testEvents);
    console.log(`Successfully created ${createdEvents.length} test events`);

    // Display created events
    console.log('\nCreated events:');
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.date}) - ${event.category} - ₹${event.price?.toLocaleString()}`);
    });

    console.log('\nEvents seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedEvents();

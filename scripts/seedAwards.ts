import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Award from '../models/Award';

// Load environment variables
dotenv.config();

// Test awards data
const testAwards = [
  {
    title: "Best Resort Experience 2024",
    description: "Recognized for providing exceptional guest experiences and outstanding hospitality services throughout the year.",
    year: 2024,
    organization: "Hospitality Excellence Awards",
    category: "Excellence in Service",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center",
      publicId: "award-best-resort-2024"
    },
    isActive: true,
    order: 1
  },
  {
    title: "Environmental Sustainability Award",
    description: "Awarded for our commitment to eco-friendly practices and sustainable tourism initiatives.",
    year: 2024,
    organization: "Green Tourism Board",
    category: "Environmental Excellence",
    image: {
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop&crop=center",
      publicId: "award-environmental-2024"
    },
    isActive: true,
    order: 2
  },
  {
    title: "Customer Choice Award",
    description: "Voted by our guests as their favorite resort destination for family vacations and romantic getaways.",
    year: 2023,
    organization: "Travel & Leisure Magazine",
    category: "Customer Satisfaction",
    image: {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center",
      publicId: "award-customer-choice-2023"
    },
    isActive: true,
    order: 3
  },
  {
    title: "Innovation in Hospitality",
    description: "Recognized for implementing cutting-edge technology and innovative guest services that enhance the overall experience.",
    year: 2023,
    organization: "Hospitality Innovation Council",
    category: "Innovation Award",
    image: {
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&crop=center",
      publicId: "award-innovation-2023"
    },
    isActive: true,
    order: 4
  },
  {
    title: "Best Spa & Wellness Center",
    description: "Awarded for our world-class spa facilities and wellness programs that promote relaxation and rejuvenation.",
    year: 2023,
    organization: "Spa & Wellness Association",
    category: "Spa & Wellness",
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
      publicId: "award-spa-wellness-2023"
    },
    isActive: true,
    order: 5
  },
  {
    title: "Community Service Excellence",
    description: "Recognized for our active involvement in local community development and social responsibility initiatives.",
    year: 2022,
    organization: "Community Development Foundation",
    category: "Community Service",
    image: {
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&crop=center",
      publicId: "award-community-service-2022"
    },
    isActive: true,
    order: 6
  },
  {
    title: "Best Adventure Tourism Destination",
    description: "Awarded for providing exceptional adventure activities and outdoor experiences for thrill-seeking guests.",
    year: 2022,
    organization: "Adventure Tourism Board",
    category: "Adventure Tourism",
    image: {
      url: "https://images.unsplash.com/photo-1551632811-561732d71c71?w=800&h=600&fit=crop&crop=center",
      publicId: "award-adventure-2022"
    },
    isActive: true,
    order: 7
  },
  {
    title: "Excellence in Food & Beverage",
    description: "Recognized for our outstanding culinary offerings and exceptional dining experiences across all our restaurants.",
    year: 2022,
    organization: "Culinary Excellence Society",
    category: "Dining Excellence",
    image: {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center",
      publicId: "award-culinary-2022"
    },
    isActive: true,
    order: 8
  },
  {
    title: "Best Wedding Destination",
    description: "Awarded for providing magical wedding experiences and exceptional banquet services for couples' special day.",
    year: 2021,
    organization: "Wedding Planning Association",
    category: "Wedding Services",
    image: {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&crop=center",
      publicId: "award-wedding-2021"
    },
    isActive: true,
    order: 9
  },
  {
    title: "Leadership in Tourism",
    description: "Recognized for our leadership role in promoting sustainable tourism and setting industry standards.",
    year: 2021,
    organization: "Tourism Leadership Council",
    category: "Leadership Award",
    image: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
      publicId: "award-leadership-2021"
    },
    isActive: true,
    order: 10
  },
  {
    title: "Best Family Resort",
    description: "Awarded for providing exceptional family-friendly amenities and activities that create lasting memories.",
    year: 2021,
    organization: "Family Travel Association",
    category: "Family Services",
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      publicId: "award-family-2021"
    },
    isActive: true,
    order: 11
  },
  {
    title: "Quality Assurance Excellence",
    description: "Recognized for maintaining the highest standards of service quality and guest satisfaction consistently.",
    year: 2020,
    organization: "Quality Standards Institute",
    category: "Quality Assurance",
    image: {
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
      publicId: "award-quality-2020"
    },
    isActive: true,
    order: 12
  }
];

async function seedAwards() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Connected to MongoDB');

    // Clear existing awards
    await Award.deleteMany({});
    console.log('Cleared existing awards');

    // Insert test awards
    const createdAwards = await Award.insertMany(testAwards);
    console.log(`Successfully created ${createdAwards.length} test awards`);

    // Display created awards
    console.log('\nCreated awards:');
    createdAwards.forEach((award, index) => {
      console.log(`${index + 1}. ${award.title} (${award.year}) - ${award.organization}`);
    });

    console.log('\nAwards seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding awards:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedAwards();

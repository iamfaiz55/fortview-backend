import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HomeGalleryItem from '../models/HomeGallerySection';

dotenv.config();

const defaultGalleryItems = [
  {
    title: "Majestic Waterfalls",
    description: "Natural beauty that takes your breath away",
    detailedDescription: "Experience the breathtaking beauty of our natural waterfalls surrounded by lush tropical vegetation. This stunning natural attraction creates a perfect backdrop for photos and provides a peaceful retreat for guests seeking tranquility.",
    category: "Natural Attractions",
    capacity: "50-100 people",
    area: "2,500 sq ft",
    features: ["Natural Rock Formation", "Tropical Vegetation", "Photo Opportunities", "Peaceful Ambiance"],
    rating: 4.8,
    icon: "Waves",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 1
  },
  {
    title: "Lush Green Lawns",
    description: "Perfect for outdoor events and relaxation",
    detailedDescription: "Our meticulously maintained green lawns offer the perfect setting for outdoor events, picnics, and relaxation. With panoramic views of the surrounding landscape, these spacious grounds provide an ideal venue for weddings, corporate events, and family gatherings.",
    category: "Resort Grounds",
    capacity: "200-500 people",
    area: "15,000 sq ft",
    features: ["Well-Maintained Grass", "Panoramic Views", "Event Setup Available", "Outdoor Seating"],
    rating: 4.9,
    icon: "MapPin",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 2
  },
  {
    title: "Kids' Adventure Zone",
    description: "Safe and exciting play areas for children",
    detailedDescription: "A dedicated safe space designed specifically for children to play, explore, and have fun. Our adventure zone features age-appropriate equipment, soft play areas, and supervised activities that ensure both safety and entertainment for young guests.",
    category: "Family Activities",
    capacity: "30-50 children",
    area: "3,000 sq ft",
    features: ["Age-Appropriate Equipment", "Soft Play Areas", "Supervised Activities", "Safety First"],
    rating: 4.7,
    icon: "Users",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 3
  },
  {
    title: "Luxury Accommodations",
    description: "Elegant rooms with stunning views",
    detailedDescription: "Experience luxury and comfort in our beautifully designed rooms. Each room offers modern amenities, stunning views of the surrounding landscape, and a perfect blend of comfort and elegance for an unforgettable stay.",
    category: "Accommodations",
    capacity: "2-4 guests",
    area: "400-600 sq ft",
    features: ["Modern Amenities", "Scenic Views", "Premium Bedding", "Private Balcony"],
    rating: 4.9,
    icon: "Star",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 4
  },
  {
    title: "Fine Dining Restaurant",
    description: "Culinary excellence in a beautiful setting",
    detailedDescription: "Indulge in exquisite culinary experiences at our fine dining restaurant. Our expert chefs prepare delicious meals using fresh, locally sourced ingredients, served in an elegant atmosphere with panoramic views.",
    category: "Dining",
    capacity: "80-120 guests",
    area: "2,000 sq ft",
    features: ["Expert Chefs", "Fresh Ingredients", "Elegant Atmosphere", "Wine Selection"],
    rating: 4.8,
    icon: "Calendar",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 5
  },
  {
    title: "Wedding Venues",
    description: "Perfect settings for your special day",
    detailedDescription: "Create unforgettable memories in our stunning wedding venues. From intimate ceremonies to grand celebrations, we provide the perfect backdrop for your special day with professional event planning services.",
    category: "Events",
    capacity: "100-500 guests",
    area: "5,000-10,000 sq ft",
    features: ["Professional Planning", "Beautiful Decor", "Catering Services", "Photography Spots"],
    rating: 4.9,
    icon: "Users2",
    image: {
      url: "https://res.cloudinary.com/drbaz5inu/image/upload/v1758400086/designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g.jpg",
      publicId: "designhub/carousel/desktop/o5wtpp5qizb7vrabpz9g"
    },
    isActive: true,
    order: 6
  }
];

async function seedGalleryData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await HomeGalleryItem.deleteMany({});
    console.log('Cleared existing gallery items');

    // Insert default data
    const insertedItems = await HomeGalleryItem.insertMany(defaultGalleryItems);
    console.log(`Successfully inserted ${insertedItems.length} gallery items`);

    console.log('Gallery data seeded successfully!');
  } catch (error) {
    console.error('Error seeding gallery data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedGalleryData();

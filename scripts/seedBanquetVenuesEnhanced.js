const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema (simplified version for seeding)
const banquetVenueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  capacity: { type: String, required: true },
  area: { type: String, required: true },
  ac: { type: String, required: true },
  description: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  features: [{ type: String }],
  pricing: {
    basePrice: { type: Number },
    currency: { type: String, default: 'INR' },
    includes: [{ type: String }]
  },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BanquetVenue = mongoose.model('BanquetVenue', banquetVenueSchema);

// Enhanced sample venues with more realistic data
const sampleVenues = [
  {
    title: "Diamond Hall",
    capacity: "Indoor • 500+ Guests",
    area: "750 sq. ft.",
    ac: "Fully Air-Conditioned",
    description: "An elegant hall with premium lighting, modern decor, and versatile layouts perfect for grand receptions and corporate events. Features crystal chandeliers and marble flooring.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "diamond-hall-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "diamond-hall-2"
      }
    ],
    features: ["Premium Lighting", "Modern Decor", "Versatile Layouts", "Sound System", "Projector Screen", "Crystal Chandeliers", "Marble Flooring"],
    pricing: {
      basePrice: 50000,
      currency: "INR",
      includes: ["Basic Decoration", "Sound System", "Lighting", "Tables & Chairs", "Stage Setup", "WiFi", "Air Conditioning"]
    },
    location: "Ground Floor, Main Building",
    isActive: true,
    order: 1
  },
  {
    title: "Emerald Hall",
    capacity: "Indoor • 200 Guests",
    area: "8,000 sq. ft.",
    ac: "Fully Air-Conditioned",
    description: "Emerald Hall offers a modern yet warm ambiance, ideal for weddings, conferences, and intimate gatherings with style. Features elegant chandeliers and contemporary design elements with emerald green accents.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "emerald-hall-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "emerald-hall-2"
      }
    ],
    features: ["Modern Ambiance", "Intimate Setting", "Conference Ready", "Elegant Chandeliers", "Contemporary Design", "Emerald Accents", "Premium Seating"],
    pricing: {
      basePrice: 35000,
      currency: "INR",
      includes: ["Basic Decoration", "Sound System", "Projector", "Tables & Chairs", "WiFi", "Air Conditioning", "Conference Setup"]
    },
    location: "First Floor, Main Building",
    isActive: true,
    order: 2
  },
  {
    title: "Ruby Hall",
    capacity: "Indoor • 150 Guests",
    area: "4,500 sq. ft.",
    ac: "Fully Air-Conditioned",
    description: "Ruby Hall is cozy yet elegant, ideal for smaller gatherings, cocktail parties, and private functions with premium comfort. Features warm lighting, sophisticated ambiance, and ruby red accents throughout.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "ruby-hall-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "ruby-hall-2"
      }
    ],
    features: ["Cozy Elegance", "Cocktail Parties", "Private Functions", "Warm Lighting", "Sophisticated Ambiance", "Ruby Accents", "Premium Bar"],
    pricing: {
      basePrice: 30000,
      currency: "INR",
      includes: ["Premium Decoration", "Sound System", "Bar Setup", "Tables & Chairs", "Cocktail Service", "Air Conditioning", "Private Entrance"]
    },
    location: "Second Floor, Main Building",
    isActive: true,
    order: 3
  },
  {
    title: "Topaz Hall",
    capacity: "Indoor • 75 Guests",
    area: "6,000 sq. ft.",
    ac: "Non-AC (Well Ventilated)",
    description: "A charming venue that blends tradition and function, perfect for cultural events, family celebrations, and social functions. Features traditional architecture with modern amenities and natural ventilation.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "topaz-hall-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "topaz-hall-2"
      }
    ],
    features: ["Traditional Design", "Cultural Events", "Family Celebrations", "Natural Ventilation", "Traditional Architecture", "Topaz Accents", "Cultural Decor"],
    pricing: {
      basePrice: 20000,
      currency: "INR",
      includes: ["Basic Decoration", "Tables & Chairs", "Basic Lighting", "Fan Cooling", "Traditional Setup", "Cultural Music System"]
    },
    location: "Ground Floor, Annex Building",
    isActive: true,
    order: 4
  },
  {
    title: "Silver Lawn",
    capacity: "Outdoor • 250 Guests",
    area: "3,500 sq. ft.",
    ac: "Open Air",
    description: "Silver Lawn offers a serene outdoor experience with beautiful landscaping and natural surroundings. Perfect for intimate outdoor weddings, garden parties, and special celebrations under the stars with silver-themed decorations.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "silver-lawn-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "silver-lawn-2"
      }
    ],
    features: ["Serene Outdoor", "Beautiful Landscaping", "Natural Surroundings", "Intimate Setting", "Garden Parties", "Silver Theme", "Starry Nights"],
    pricing: {
      basePrice: 25000,
      currency: "INR",
      includes: ["Tent Setup", "Garden Decoration", "Basic Sound", "Tables & Chairs", "Lighting", "Silver Theme Decor", "Garden Setup"]
    },
    location: "Garden Area, Resort Grounds",
    isActive: true,
    order: 5
  },
  {
    title: "Ashoka Lawn",
    capacity: "Outdoor • 350 Guests",
    area: "4,500 sq. ft.",
    ac: "Open Air",
    description: "🌿 Ashoka Lawn is a spacious 4,500 sq. ft. open-air venue perfect for weddings, parties, and celebrations.✨ With a capacity of 350 guests, it offers the ideal blend of elegance and comfort.🎉 Surrounded by Ashoka trees and greenery, it creates a refreshing and memorable atmosphere for every event.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "ashoka-lawn-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "ashoka-lawn-2"
      }
    ],
    features: ["Open Air", "Natural Greenery", "Wedding Ready", "Large Capacity", "Spacious Layout", "Ashoka Trees", "Natural Shade"],
    pricing: {
      basePrice: 40000,
      currency: "INR",
      includes: ["Tent Setup", "Basic Decoration", "Sound System", "Tables & Chairs", "Lighting", "Natural Shade", "Garden Setup"]
    },
    location: "Garden Area, Resort Grounds",
    isActive: true,
    order: 6
  },
  {
    title: "Crystal Lawn",
    capacity: "Outdoor • 400+ Guests",
    area: "5,500 sq. ft.",
    ac: "Open Air",
    description: "Crystal Lawn is our largest outdoor venue, perfect for grand celebrations and large gatherings. Features crystal-clear views, premium landscaping, and state-of-the-art facilities for unforgettable events under the open sky.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "crystal-lawn-1"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "crystal-lawn-2"
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f2946e4c0e?w=800&h=600&fit=crop",
        publicId: "crystal-lawn-3"
      }
    ],
    features: ["Largest Outdoor Venue", "Crystal Clear Views", "Premium Landscaping", "Grand Celebrations", "State-of-the-art Facilities", "Crystal Theme", "Premium Setup"],
    pricing: {
      basePrice: 55000,
      currency: "INR",
      includes: ["Premium Tent Setup", "Luxury Decoration", "Professional Sound", "Premium Tables & Chairs", "LED Lighting", "Catering Setup", "Crystal Theme Decor"]
    },
    location: "Main Garden, Resort Grounds",
    isActive: true,
    order: 7
  }
];

async function seedBanquetVenues() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing venues
    await BanquetVenue.deleteMany({});
    console.log('Cleared existing banquet venues');

    // Insert sample venues
    const insertedVenues = await BanquetVenue.insertMany(sampleVenues);
    console.log(`Inserted ${insertedVenues.length} banquet venues:`);
    
    // Log the inserted venues
    insertedVenues.forEach((venue, index) => {
      console.log(`${index + 1}. ${venue.title} - ${venue.capacity} - ${venue.area}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding banquet venues:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBanquetVenues();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from '../models/Game';

// Load environment variables
dotenv.config();

const sampleGames = [
  {
    title: "Cricket Tournament",
    description: "Join our exciting cricket tournament with teams from different departments. Experience the thrill of competitive cricket in our beautiful outdoor grounds with proper pitch and facilities.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
      publicId: "games/cricket_tournament"
    }
  },
  {
    title: "Badminton Championship",
    description: "Fast-paced badminton championship for all skill levels. Our indoor courts provide the perfect environment for this exciting racquet sport.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      publicId: "games/badminton_championship"
    }
  },
  {
    title: "Kids Treasure Hunt",
    description: "An adventurous treasure hunt designed specifically for children. Kids will explore our resort grounds while solving clues and finding hidden treasures.",
    categories: ["child"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
      publicId: "games/kids_treasure_hunt"
    }
  },
  {
    title: "Volleyball Tournament",
    description: "Beach volleyball tournament on our specially designed courts. Perfect for team building and friendly competition under the sun.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1612872087724-bb876b2e67d1?w=800&h=600&fit=crop",
      publicId: "games/volleyball_tournament"
    }
  },
  {
    title: "Table Tennis Championship",
    description: "Fast-paced table tennis competition for players of all levels. Our professional tables and equipment ensure the best playing experience.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      publicId: "games/table_tennis_championship"
    }
  },
  {
    title: "Children's Art Competition",
    description: "Creative art competition for children where they can express their imagination through painting, drawing, and craft activities.",
    categories: ["child"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      publicId: "games/children_art_competition"
    }
  },
  {
    title: "Carrom Championship",
    description: "Traditional carrom board championship. Test your precision and strategy in this classic Indian board game.",
    categories: ["common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop",
      publicId: "games/carrom_championship"
    }
  },
  {
    title: "Chess Tournament",
    description: "Strategic chess tournament for minds that love to think ahead. Our peaceful environment provides the perfect setting for intense mental battles.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&h=600&fit=crop",
      publicId: "games/chess_tournament"
    }
  },
  {
    title: "Swimming Competition",
    description: "Swimming competition in our crystal-clear pool. Multiple categories for different age groups and skill levels.",
    categories: ["common"],
    isActive: true,
    isUpcoming: true,
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      publicId: "games/swimming_competition"
    }
  },
  {
    title: "Kids Mini Olympics",
    description: "Special mini olympics event designed for children with various fun activities including running, jumping, and team games.",
    categories: ["child"],
    isActive: true,
    isUpcoming: true,
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      publicId: "games/kids_mini_olympics"
    }
  },
  {
    title: "Basketball Tournament",
    description: "High-energy basketball tournament on our full-sized court. Perfect for basketball enthusiasts looking for competitive play.",
    categories: ["adult"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      publicId: "games/basketball_tournament"
    }
  },
  {
    title: "Family Fun Games",
    description: "Special family-oriented games and activities designed to bring families together. Includes relay races, team building activities, and fun competitions.",
    categories: ["common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      publicId: "games/family_fun_games"
    }
  },
  {
    title: "Tug of War Championship",
    description: "Traditional tug of war competition testing strength and teamwork. Multiple team categories and exciting matches.",
    categories: ["adult", "common"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      publicId: "games/tug_of_war_championship"
    }
  },
  {
    title: "Kids Storytelling Session",
    description: "Interactive storytelling session for children with engaging stories, puppet shows, and creative activities.",
    categories: ["child"],
    isActive: true,
    isUpcoming: false,
    image: {
      url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
      publicId: "games/kids_storytelling_session"
    }
  },
  {
    title: "Summer Sports Festival",
    description: "Annual summer sports festival featuring multiple sports and activities. A grand event with prizes, trophies, and celebration.",
    categories: ["common"],
    isActive: false,
    isUpcoming: true,
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      publicId: "games/summer_sports_festival"
    }
  }
];

async function seedGames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Connected to MongoDB');

    // Clear existing games (optional - remove this line if you want to keep existing data)
    await Game.deleteMany({});
    console.log('Cleared existing games data');

    // Insert sample games
    const createdGames = await Game.insertMany(sampleGames);
    console.log(`Successfully created ${createdGames.length} games`);

    // Display created games
    console.log('\nCreated games:');
    createdGames.forEach((game, index) => {
      console.log(`${index + 1}. ${game.title} - ${game.categories.join(', ')} - ${game.isActive ? 'Active' : 'Inactive'} ${game.isUpcoming ? '- Upcoming' : ''}`);
    });

    console.log('\nGames seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding games:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedGames();


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from './config/passport';
import authRouter from './routes/auth.routes';
import contactRouter from './routes/contact.routes';
import carouselRouter from './routes/carousel.routes';
import homeGalleryRouter from './routes/homeGallery.routes';
import offerRouter from './routes/offer.routes';
import selfiePointRouter from './routes/selfiePoint.routes';
import activityRouter from './routes/activity.routes';
import adventureActivityRouter from './routes/adventureActivity.routes';
import banquetVenueRouter from './routes/banquetVenue.routes';
import galleryRouter from './routes/gallery.routes';
import eventRouter from './routes/event.routes';
import gameRouter from './routes/games.routes';
import spaWellnessRouter from './routes/spaAndWellness.routes';
import awardRouter from './routes/award.routes';
import foodRouter from './routes/food.routes';
import foodStallRouter from './routes/foodStall.routes';
// Routes
// import authRoutes from './routes/auth';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
}));

// console.log("jhdfjksh");

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGO_URL as string)


// Routes
app.use('/api/auth', authRouter);
app.use('/api', contactRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/home-gallery', homeGalleryRouter);
app.use('/api/offers', offerRouter);
app.use('/api/selfie-points', selfiePointRouter);
app.use('/api/activities', activityRouter);
app.use('/api/adventure-activities', adventureActivityRouter);
app.use('/api/banquet-venues', banquetVenueRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/events', eventRouter);
app.use('/api/games', gameRouter);
app.use('/api/spa-and-wellness', spaWellnessRouter);
app.use('/api/awards', awardRouter);
app.use('/api/foods', foodRouter);
app.use('/api/food-stalls', foodStallRouter);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use( (req, res) => {
  res.status(404).json({ message: 'Route not found from design hub server' });
});

mongoose.connection.once("open", ()=> {
  console.log("mongo connected");
  
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})
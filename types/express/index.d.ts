// import { UserDocument } from '../../models/User'; // adjust path based on your project

declare global {
  namespace Express {
    interface Request {
      user?: any; // or define the shape manually if needed
    }
  }
}

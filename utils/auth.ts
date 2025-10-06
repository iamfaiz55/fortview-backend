import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()

// console.log("");

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as unknown as number, // ← fix here
  };

  return jwt.sign({ id }, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};

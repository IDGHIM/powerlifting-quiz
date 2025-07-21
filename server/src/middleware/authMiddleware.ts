import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Typage du payload JWT
interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Étendre Request pour inclure user
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
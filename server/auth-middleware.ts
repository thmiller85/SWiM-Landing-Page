import { Request, Response, NextFunction } from 'express';
import { SessionUser } from '@shared/schema';

// Extend the session interface to only store secure user data
declare module 'express-session' {
  interface SessionData {
    user: SessionUser;
  }
}

// Authentication middleware - checks if user is logged in
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }
  
  // Add user to request for easy access
  req.user = req.session.user;
  next();
}

// Authorization middleware - checks if user has admin role
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Admin privileges required for this action'
    });
  }
  
  req.user = req.session.user;
  next();
}

// Authorization middleware - checks if user has admin or editor role
export function requireEditor(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }
  
  const allowedRoles = ['admin', 'editor'];
  if (!allowedRoles.includes(req.session.user.role)) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Editor or admin privileges required for this action'
    });
  }
  
  req.user = req.session.user;
  next();
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
import { Request, Response, NextFunction } from 'express';
import UserModel from '../database/models/userModel';
import userService from '../service/userService';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const lockoutStatus = userService.isLockedOut(user);
    if (lockoutStatus.locked) {
      return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
    }

    const isMatch = await userService.comparePassword(req.body.password, user.password);
    if (isMatch) {
      res.cookie('sessionId', 'your_session_id', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });

      req.user = user;  
      next();
    } else {
      userService.recordFailedAttempt(user);
      return res.status(401).json({ error: 'Invalid credentials!' });
    }
  } catch (error) {
    console.log("Error in authentication middleware:", error);
    return res.status(500).json({ error: 'Error during authentication.' });
  }
};
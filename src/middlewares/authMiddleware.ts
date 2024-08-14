import { Request, Response, NextFunction } from 'express';
import LoginAttemptService from '../service/userServices/loginAttemptService';
import UserModel from '../database/models/userModel';
import passwordService from '../service/userServices/passwordService';


export const authtenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, password } = req.body;
    const ipAddr = req.socket.remoteAddress || 'unknown-ip';
    const user = await UserModel.findOne({ where: { email } });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (await LoginAttemptService.isLockedOut(ipAddr)) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    if (!user) throw new Error("User not found.");
    
    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      await LoginAttemptService.recordFailedAttempt(ipAddr);
      res.status(401).json({error: 'Invalid credentials!'});
    }

    req.user = user; 
    next();
  }catch(error){
      console.error("Unexpected error during authentication:", error);
      res.status(500).json({ error: 'An unexpected error occurred during authentication.' });
  }
}
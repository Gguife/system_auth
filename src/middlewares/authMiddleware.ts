import { Request, Response, NextFunction } from 'express';
import LoginAttemptService from '../service/userServices/loginAttemptService';
import UserModel from '../database/models/userModel';
import passwordService from '../service/userServices/passwordService';


export const authUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const ipAddr = req.socket.remoteAddress || 'unknown-ip';
  const user = await UserModel.findOne({ where: { email } });

  if(!user) return res.status(404).json({error: "User not found"});

  if (await LoginAttemptService.isLockedOut(ipAddr)) return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });

  const isMatch = await passwordService.comparePassword(password, user.password);
  if (!isMatch) {
    await LoginAttemptService.recordFailedAttempt(ipAddr);
    return res.status(401).json({ error: 'Invalid Credentials.' });
  }
  
  req.user = user;
  next();
}
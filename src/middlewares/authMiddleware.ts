import { Request, Response, NextFunction } from 'express';
import AuthService from '../service/userServices/authService';
import LoginAttemptService from '../service/userServices/loginAttemptService';


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, password } = req.body;
    const ipAddr = req.socket.remoteAddress || 'unknown-ip';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (await LoginAttemptService.isLockedOut(ipAddr)) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    const user = await AuthService.authenticate(email, password, ipAddr);

    req.user = user; 
    next();
  }catch(error){
    console.log("Error authenticating user:", error);
    res.status(500).json({error: 'Error authenticating user.'})
  }
}
import { Request, Response, NextFunction } from 'express';
import AuthService from '../service/authService';


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await AuthService.authenticate(email, password);

    req.user = user; 
    next();
  }catch(error){
    console.log("Error authenticating user:", error);
    res.status(500).json({error: 'Error authenticating user.'})
  }
}
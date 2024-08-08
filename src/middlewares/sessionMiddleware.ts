import { Request, Response, NextFunction } from 'express';
import UserModel from '../database/models/userModel';
import userService from '../service/userService';

export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.body.sessionId;

  if(!sessionId){
    return res.status(401).json({message: 'No session found.'})
  }
  
  try{

    
  }catch(e){

  }

}
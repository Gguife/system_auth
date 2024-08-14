import UserModel from "database/models/userModel";
import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken"; 

export const SECRET_KEY = process.env.JWT_SECRET || "d6d385d17071fa6df812d774d3f41285dd7b321bfa4da86dcb0eb256f9ab7f61";

export const authtenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) return res.status(401).json({error: "Token not found."})
  
  jsonwebtoken.verify(token, SECRET_KEY, (error: any, user: any) => {
    if(error) return res.status(403).json({error: error});
    req.user = user as UserModel;
    next();
  })
}
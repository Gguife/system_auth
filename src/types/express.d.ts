import UserModel from '../database/models/userModel'; 

declare global {
  namespace Express {
    interface Request {
      user?: UserModel; 
    }
  }
}
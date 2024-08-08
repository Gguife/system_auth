import UserModel from '../database/models/userModel';  // Ajuste o caminho conforme sua estrutura de projeto

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;  
    }
  }
}
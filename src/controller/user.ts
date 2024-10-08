import { Request, Response } from "express";
import UserModel from "../database/models/userModel";
import passwordService from "../service/userServices/passwordService";
import jsonwebtoken from "jsonwebtoken"; 
import { SECRET_KEY } from "../middlewares/jwtMiddleware";

const getUser = async (req: Request, res: Response) => {
  try{
    const user = await UserModel.findByPk(req.params.id);
    
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    return res.status(200).json({user});
  }catch(error){
    console.log("Error finding user:", error);
    return res.status(500).json({error: 'Error finding user.'});
  }
}

const createUser = async (req: Request, res: Response) => {
  try{
    const { name, email, password } = req.body;
    const emailDB = await UserModel.findOne({ where: { email } });

    if(emailDB){
      return res.status(409).json({error: "User already exists"})
    }

    if(!passwordService.validatePassword(password)){
      return res.status(400).json({error: 'Password is not strong enough.'})
    }

    const hashedPassword = await passwordService.hashPassword(password);

    const newUser = await UserModel.create({
      name,
      password: hashedPassword,
      email
    });

    return res.status(201).json(newUser);
  }catch(error){
    console.log("Error adding user:", error);
    return res.status(500).json({error: 'Error adding user.'});
  }
}


const loginUser = async (req: Request, res: Response) => {
  try{ 
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid Credentials.' });
    }

    const payload = {id: req.user.id, name: req.user.name, email: req.user.email};

    const token = jsonwebtoken.sign(
      {user: JSON.stringify(payload)},
      SECRET_KEY,
      {expiresIn: '60m'}
    )
  
    res.status(200).json({ message: 'Login successful!', token, user: req.user});
  }catch(error){
    console.log("Error logging in:", error);
    return res.status(500).json({error: 'Error logging in.'})
  }
}

export default { getUser, createUser, loginUser };
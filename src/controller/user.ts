import { Request, Response } from "express";
import UserModel from "../database/models/userModel";
import userService from "../service/userService";

const findAllUsers = async (req: Request, res: Response) => {
  try{
    const users = await UserModel.findAll();
    return res.status(200).json({users});
  }catch(error){
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Error finding all users.'});
  }
}

const findOneUser = async (req: Request, res: Response) => {
  try{
    const user = await UserModel.findByPk(req.params.id);
    return res.status(200).json({user})
  }catch(error){
    console.log("Error finding user:", error);
    return res.status(500).json({error: 'Error finding user.'});
  }
}

const addUser = async (req: Request, res: Response) => {
  try{
    const password = req.body.password;

    if(!userService.validatePassword(password)){
      return res.status(400).json({error: 'Password is not strong enough.'})
    }

    const hashedPassword = await userService.hashPassword(password);

    const newUser = await UserModel.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email
    })

    return res.status(201).json(newUser);
  }catch(error){
    console.log("Error adding user:", error);
    return res.status(500).json({error: 'Error adding user.'});
  }
}

const updateUser = async (req: Request, res: Response) => {
  try{
    const password = req.body.password;

    if(!userService.validatePassword(password)){
      return res.status(400).json({error: 'Password is not strong enough.'})
    }

    const hashedPassword = await userService.hashPassword(password);

    UserModel.update({
      password: hashedPassword,
    },{
      where:{
        id: req.params.id
      }
    }).then((result) => res.json(result));
  }catch(error){
    console.log("Error updating user:", error);
    return res.status(500).json({error: 'Error updating user.'});
  }
}

const removeUser = async (req: Request, res: Response) => {
  try{
    UserModel.destroy({
      where:{
        id: req.params.id
      }
    }).then((result) => res.json(result));
  }catch(error){
    console.log("Error removing user:", error);
    return res.status(500).json({error: 'Error removing user.'});
  }
}


const loginUser = async (req: Request, res: Response) => {
  try{
    const user = await UserModel.findOne({
      where: {
        email: req.body.email
      }
    });

    if(user){
      const isMatch = await userService.comparePassword(req.body.password, user.password)
      
      if(isMatch){
        return res.status(200).json({message: 'Login sucessful!', user});
      }else{
        return res.status(401).json({error: 'Invalid credentials!'})
      }

    }else{
      return res.status(404).json({error: 'User not found.'})
    }

  }catch(error){
    console.log("Error logging in:", error);
    return res.status(500).json({error: 'Error logging in.'})
  }
}

export default { findAllUsers, findOneUser, addUser, updateUser, removeUser, loginUser };
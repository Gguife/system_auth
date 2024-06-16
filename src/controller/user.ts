import { Request, Response } from "express";
import UserModel from "../database/models/userModel";

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
    const newUser = await UserModel.create({
      name: req.body.name,
      password: req.body.password,
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
    UserModel.update({
      password: req.body.password,
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

export default { findAllUsers, findOneUser, addUser, updateUser, removeUser };
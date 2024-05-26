import { Request, Response } from "express";
import UserModel from "database/models/userModel";

const findAllUsers = async (req: Request, res: Response) => {
  try{
    const users = UserModel.findAll();
    return res.status(200).json({users});
  }catch(error){
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Internal server error.'});
  }
}

const findOneUser = async (req: Request, res: Response) => {
  try{
    const user = await UserModel.findByPk(req.params.id);
    return res.status(200).json({user})
  }catch(error){
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Internal server error.'});
  }
}

const addUser = async (req: Request, res: Response) => {
  try{
    UserModel.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    }).then((result) => res.json(result));
  }catch(error){
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Internal server error.'});
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
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Internal server error.'});
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
    console.log("Error finding all users:", error);
    return res.status(500).json({error: 'Internal server error.'});
  }
}

export default { findAllUsers, findOneUser, addUser, updateUser, removeUser };
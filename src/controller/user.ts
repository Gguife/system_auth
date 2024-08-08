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

    const [affectedRows] = await UserModel.update({
      password: hashedPassword,
    }, {
      where: {
        id: req.params.id
      }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.' });
  }catch(error){
    console.log("Error updating user:", error);
    return res.status(500).json({error: 'Error updating user.'});
  }
}

const removeUser = async (req: Request, res: Response) => {
  try{
    const result = await UserModel.destroy({
      where:{
        id: req.params.id
      }
    })

    if (result === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User removed successfully.' });
  } catch (error) {
    console.log("Error removing user:", error);
    return res.status(500).json({ error: 'Error removing user.' });
  }
}


const loginUser = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ error: 'Error logging in.' });
  }
}

export default { findAllUsers, findOneUser, addUser, updateUser, removeUser, loginUser };
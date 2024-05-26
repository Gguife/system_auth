import { Router } from "express";
import user from "../controller/user";

const route = Router();

route.get('/users', user.findAllUsers);
route.get('/users/:id', user.findOneUser);
route.post('/users', user.addUser);
route.put('/users/:id', user.updateUser);
route.delete('/users/:id', user.removeUser);


export default route;
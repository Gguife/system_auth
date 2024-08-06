import { Router } from "express";
import user from "../controller/user";

const route = Router();

route.get('/users', user.findAllUsers);
route.get('/account/:id', user.findOneUser);
route.post('/account/create', user.addUser);
route.put('/account/update/:id', user.updateUser);
route.delete('/account/remove/:id', user.removeUser);
route.post('/login', user.loginUser);

export default route;
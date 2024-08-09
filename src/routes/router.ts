import { Router } from "express";
import user from "../controller/user";
import { authenticateUser } from "../middlewares/authMiddleware";

const route = Router();

route.get('/user/:id', user.getUser);
route.post('/account/create', user.createUser);
route.post('/login', authenticateUser, user.loginUser);

export default route;
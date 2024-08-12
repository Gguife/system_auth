import { Router } from "express";
import user from "../controller/user";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.get('/user/:id', user.getUser);
router.post('/account/create', user.createUser);
router.post('/login', authenticateUser, user.loginUser);

export default router;
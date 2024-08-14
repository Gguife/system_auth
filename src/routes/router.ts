import { Router, Response, Request } from "express";
import user from "../controller/user";
import { authtenticateUser } from "../middlewares/authMiddleware";
import { authtenticateToken } from "../middlewares/jwtMiddleware";

const router = Router();

router.get('/user/:id', user.getUser);
router.post('/account/create', user.createUser);
router.post('/login', authtenticateUser, user.loginUser);

router.get('/private', authtenticateToken, (req: Request, res: Response) => {
  res.json(req.user);
});

export default router;
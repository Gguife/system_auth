import { Request, Response } from "express";
import userController from "../controller/user";
import UserModel from "../database/models/userModel";
import PasswordService from "../service/userServices/passwordService";
import jsonwebtoken from "jsonwebtoken";

jest.mock("../database/models/userModel");
jest.mock("../service/userServices/passwordService");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

function createMockReqRes() {
  return {
    req: { body: {}, params: {} } as unknown as Request,
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
  };
}

describe("User Controller Tests", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    ({ req, res } = createMockReqRes());
  });

  describe("get user Controller", () => {
    it("should return user data when user is found", async () => {
      req.params = { id: '1' };
      (UserModel.findByPk as jest.Mock).mockResolvedValue({ id: '1', name: 'testuser' });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: '1', name: 'testuser' } });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: '1' };
      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it("should return 500 if there is an error", async () => {
      req.params = { id: '1' };
      (UserModel.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error finding user.' });
    });
  });

  describe("create user Controller", () => {
    beforeEach(() => {
      req.body = { 
        name: "username", 
        email: "username@gmail.com", 
        password: "User123456@" 
      };
    });

    it("should return 201 if user is created", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (PasswordService.validatePassword as jest.Mock).mockReturnValue(true);
      (PasswordService.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (UserModel.create as jest.Mock).mockResolvedValue({
        name: "username",
        email: "username@gmail.com",
        password: "hashedPassword"
      });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        name: "username",
        email: "username@gmail.com",
        password: "hashedPassword"
      });
    });

    it("should return 400 if the password is not strong enough", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (PasswordService.validatePassword as jest.Mock).mockReturnValue(false);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Password is not strong enough." });
    });

    it("should return 409 if the user already exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: '1', name: 'testUser', email: 'username@gmail.com' });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
    });

    it("should return 500 if there is an error", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (PasswordService.validatePassword as jest.Mock).mockReturnValue(true);
      (PasswordService.hashPassword as jest.Mock).mockRejectedValue(new Error('Hashing error'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error adding user.' });
    });
  });

  describe("login user controller", () => {
    let req: Request;
    let res: Response;
    const SECRET_KEY = process.env.SCECRET_KEY as string;

    beforeEach(() => {
      req = {} as Request;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({error: "Invalid Credentials."});
    });

    it("should return 200 and a token if login is successful", async () => {
      req.user = {id: 1, name: "Test User", email: "test@example.com"} as UserModel;

      (jsonwebtoken.sign as jest.Mock).mockReturnValue("mockedToken");

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful!',
        token: "mockedToken",
        user: req.user
      });
    });

    it("should return 500 if an error occurs during login", async () => {
      req.user = { id: 1, name: "Test User", email: "test@example.com" } as UserModel;
  
      (jsonwebtoken.sign as jest.Mock).mockImplementation(() => {
        throw new Error("Token generation error");
      });
  
      await userController.loginUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error logging in.' });
    });

  });
});

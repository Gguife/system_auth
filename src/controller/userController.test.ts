import userController from "./user";
import { Request, Response } from "express";
import UserModel from "../database/models/userModel";

jest.mock("../database/models/userModel");

describe("get user Controller", () => {
  it("should return user data when user is find", async () => {
    const req = { params: { id: '1' }} as unknown as Request;
    const res = { 
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    
    (UserModel.findByPk as jest.Mock).mockResolvedValue({id: '1', name: 'testuser'});

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: {id: '1', name: 'testuser'} });
  });

  it("should return 404 if user not found", async () => {
    const req = { params: { id: '1' }} as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (UserModel.findByPk as jest.Mock).mockResolvedValue(null);
    
    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({error: 'User not found.'});
  });

  it("should return 500 if there is an error", async () => {
    const req = { params: { id: '1' }} as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (UserModel.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error: 'Error finding user.'});
  })
})
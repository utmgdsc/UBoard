import { Request, Response } from "express";

import db from "../../../models/index";
import { User } from "../../../models/user";
import { signUpHandler, signInHandler } from "../user";

function mockRequest(data: any) {
  return { body: data };
}

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
}

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.sync({ force: true });
});

describe("v1 - User Routes", () => {
  describe("/signup endpoint", () => {
    test("If successful signup, returns 204", async () => {
      const data = {
        email: "email@mail.utoronto.ca",
        userName: "userName",
        password: "password",
        firstName: "firstName",
        lastName: "lastName",
      };
      const req = mockRequest(data) as Request;
      const res = mockResponse() as Response;
      await signUpHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalled();
    });

    test("If unsuccessful signup, returns error status", async () => {
      const data = {
        email: "email@mail.yahoo.ca",
        userName: "userName",
        password: "password",
        firstName: "firstName",
        lastName: "lastName",
      };
      const req = mockRequest(data) as Request;
      const res = mockResponse() as Response;
      await signUpHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("/signin endpoint", () => {
    test("If successful signin, returns 200 and creates cookie", async () => {
      const data = {
        userName: "userName",
        password: "password",
      };
      const req = mockRequest(data) as Request;
      const res = mockResponse() as Response;
      const userRepo: typeof User = db.User;
      const signedInUser = (await userRepo.findOne({
        where: {
          userName: "userName",
        },
      })) as User;
      signedInUser.confirmed = true;
      signedInUser.save();
      await signInHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledTimes(1);
    });

    test("If unsuccessful signin, returns error code and does not create cookie", async () => {
      const data = {
        userName: "userName",
        password: "wrongPassword",
      };
      const req = mockRequest(data) as Request;
      const res = mockResponse() as Response;
      await signInHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledTimes(0);
    });
  });
});

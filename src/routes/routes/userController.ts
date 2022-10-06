import * as index from "../index";

import { NextFunction, Request, Response } from "express";

import auth from "../../util/auth";
import { prisma } from "../..";

export class UserController {
  async get(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return users;
  }
  async create(request: Request, response: Response, next: NextFunction) {
    const { email, username, password } = request.body;
    if (email && username && password) {
      const res = await auth.createUser(email, username, password);
      return res;
    } else {
      return { error: "Not enought fields" };
    }
  }
  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    if (email && password) {
      const res = await auth.loginUser(email, password);
      return res;
    } else {
      return { error: "Not enought fields" };
    }
  }
}

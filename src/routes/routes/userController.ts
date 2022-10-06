import * as index from "../index";

import { NextFunction, Request, Response } from "express";

import { prisma } from "../..";

export class UserController {
  async get(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return users;
  }
}

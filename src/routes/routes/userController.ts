import * as index from "../index";

import { NextFunction, Request, Response } from "express";
import auth, { sanitize } from "../../util/auth";

import { prisma } from "../..";

export class UserController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return sanitize(users);
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

  async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id && (await prisma.user.findUnique({ where: { id } }))) {
      const res = await prisma.user.delete({ where: { id } });
      return { error: false, result: { user: sanitize(res), deleted: true } };
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

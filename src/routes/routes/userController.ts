import * as index from "../index";

import { NextFunction, Request, Response } from "express";
import auth, { sanitize } from "../../util/auth";

import logger from "../../util/logger";
import { prisma } from "../..";

export class UserController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    return sanitize(users);
  }

  async get(request: Request, response: Response, next: NextFunction) {
    const user = await prisma.user.findUnique({
      select: { apiKey: true, admin: true, id: true },
      where: { apiKey: request.headers.apikey?.toString() || "" },
    });
    if (!user) {
      logger.info("Requested with invalid API-Key");
      return "Invalid or missing API-Key";
    }
    if (!user.admin && user.id != request.params.id) {
      logger.info("Requested without Permission");
      return "No permission";
    }

    const resUser = await prisma.user.findFirst({
      where: { id: request.params.id == "me" ? user.id : request.params.id },
    });
    return sanitize(resUser);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { email, username, password } = request.body;
    if (email && username && password) {
      const res = await auth.createUser(email, username, password);
      return res;
    } else {
      return "Not enought fields";
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const user = await prisma.user.findUnique({
      select: { apiKey: true, admin: true, id: true },
      where: { apiKey: request.headers.apikey?.toString() || "" },
    });
    if (!user) {
      logger.info("Requested with invalid API-Key");
      return "Invalid or missing API-Key";
    }
    if (!user.admin && user.id != request.params.id) {
      logger.info("Requested without Permission");
      return "No permission";
    }

    const resUser = await prisma.user.update({
      where: { id: request.params.id == "me" ? user.id : request.params.id },
      data: sanitize(request.body, {
        permissions: !user.admin,
        id: true,
        relations: true,
      }),
    });
    return sanitize(resUser);
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id && (await prisma.user.findUnique({ where: { id } }))) {
      const res = await prisma.user.delete({ where: { id } });
      return { user: sanitize(res), deleted: true };
    } else {
      return "Not enought fields";
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    if (email && password) {
      const res = await auth.loginUser(email, password);
      return res;
    } else {
      return "Not enought fields";
    }
  }
}

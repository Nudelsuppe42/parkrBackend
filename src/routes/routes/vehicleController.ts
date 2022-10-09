import * as index from "../index";

import { NextFunction, Request, Response } from "express";
import auth, { sanitize } from "../../util/auth";

import logger from "../../util/logger";
import { prisma } from "../..";
import { userInfo } from "os";

export class VehicleController {
  async get(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    auth.verifyToken(
      request,
      response,
      "admin",
      async () => {
        const resUser = await prisma.user.findFirst({
          where: { id },
          include: { vehicle: true },
        });
        return resUser?.vehicle ? sanitize(resUser?.vehicle) : {};
      },
      id
    );
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { type, length, width, licensePlate } = request.body;

    const id = request.params.id;

    auth.verifyToken(
      request,
      response,
      "admin",
      async () => {
        const resUser = await prisma.user.findFirst({
          where: { id },
          include: { vehicle: true },
        });
        if (resUser?.vehicle != null) {
          return "User already has a vehicle assigned";
        }

        if (type && length && width && licensePlate && resUser) {
          const res = await prisma.userVehicle
            .create({
              data: {
                width,
                length,
                licensePlate,
                type: { connect: { id: type } },
                user: { connect: { id: resUser.id } },
              },
            })
            .catch((r: any) => {
              if (r.code === "P2002") return "License Plate already in use";
            });
          return res;
        } else {
          return "Not enought fields";
        }
      },
      id
    );
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    auth.verifyToken(
      request,
      response,
      "admin",
      async () => {
        const resUser = await prisma.user.update({
          where: { id },
          data: sanitize(request.body, {
            permissions: true,
            id: true,
            relations: true,
          }),
        });
        return sanitize(resUser);
      },
      id
    );
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id && (await prisma.user.findUnique({ where: { id } }))) {
      const resV = await prisma.user.update({
        where: { id },
        data: { vehicle: { delete: true } },
      });
      const resU = await prisma.user.delete({ where: { id } });
      return { user: sanitize(resU), deleted: true };
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

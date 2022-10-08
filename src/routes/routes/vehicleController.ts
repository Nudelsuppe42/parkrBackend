import * as index from "../index";

import { NextFunction, Request, Response } from "express";
import auth, { sanitize } from "../../util/auth";

import logger from "../../util/logger";
import { prisma } from "../..";
import { userInfo } from "os";

export class VehicleController {
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
      include: { vehicle: true },
    });
    return resUser?.vehicle ? sanitize(resUser?.vehicle) : {};
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { type, length, width, licensePlate } = request.body;
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

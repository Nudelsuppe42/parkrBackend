import * as index from "../index";

import { NextFunction, Request, Response } from "express";
import auth, { sanitize } from "../../util/auth";

import logger from "../../util/logger";
import { prisma } from "../..";
import { userInfo } from "os";

export class VehicleController {
  async get(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const resUser = await prisma.user.findFirst({
      where: { id },
      include: { vehicle: true },
    });
    return resUser?.vehicle ? sanitize(resUser?.vehicle) : {};
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { type, length, width, licensePlate } = request.body;
    const id = request.params.id;

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
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const resVeh = await prisma.user.update({
      where: { id },
      data: {
        vehicle: {
          update: sanitize(request.body, {
            permissions: true,
            id: true,
            relations: true,
            user: true,
            licensePlate: true,
          }),
        },
      },
      include: {
        vehicle: {
          select: {
            typeId: true,
            length: true,
            width: true,
            licensePlate: true,
          },
        },
      },
    });
    return sanitize(resVeh.vehicle);
  }
}

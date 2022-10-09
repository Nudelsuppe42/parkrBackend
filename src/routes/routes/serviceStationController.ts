import * as index from "../index";

import { NextFunction, Request, Response } from "express";

import { prisma } from "../..";
import { sanitize } from "../../util/auth";

export class ServiceStationController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    const stations = await prisma.serviceStation.findMany();
    return sanitize(stations);
  }

  async get(request: Request, response: Response, next: NextFunction) {
    const id = request.params.vid;
    const resStation = await prisma.serviceStation.findFirst({
      where: { id },
    });
    return sanitize(resStation);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { name, location, address } = request.body;
    const { short, long } = request.body.total;
    if (name && location && address && short && long) {
      const res = await prisma.serviceStation.create({
        data: {
          name,
          location,
          address,
          total: { short, long },
          aviable: { short, long },
          reserved: { short: 0, long: 0 },
          area: [],
          services: [],
        },
      });
      return res;
    } else {
      return "Not enought fields";
    }
  }
}

import * as bodyParser from "body-parser";

import express, { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import cors from "cors";
import helmet from "helmet";
import logger from "./util/logger";
import routes from "./routes";

const PORT = process.env.PORT || 8080;

logger.debug("Connecting to database...");
export const prisma = new PrismaClient();

logger.debug("Loading middleware...");
const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

logger.debug("Registering routes...");
routes.forEach((route) => {
  (app as any)[route.method.toLowerCase()](
    route.route,
    async (req: Request, res: Response, next: Function) => {
      logger.http(`${req.method} ${req.path}$`);

      // TODO: permissions

      const result = new (route.controller as any)()[route.action](
        req,
        res,
        next
      );
      if (result instanceof Promise) {
        result.then((result) =>
          result !== null && result !== undefined ? res.send(result) : undefined
        );
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }
  );
});
app.get("*", (req: Request, res: Response) => {
  res.send({ test: "test" });
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

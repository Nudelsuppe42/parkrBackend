import * as bodyParser from "body-parser";

import express, { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import auth from "./util/auth";
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
      logger.http(`${req.method} ${req.path}`);

      auth.verifyToken(
        req,
        res,
        route.auth,
        () => {
          // If auth is ok
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          returnResult(result, res);
        },
        req.params.id
      );
    }
  );
});
app.use("*", (req: Request, res: Response) => {
  res.send({ error: "Not found" });
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

function returnResult(result: any, res: Response) {
  if (result instanceof Promise) {
    result.then((result) => {
      returnResult(result, res);
    });
  } else if (typeof result === "string") {
    res.send({ error: result });
  } else {
    res.send({ error: false, result });
  }
}

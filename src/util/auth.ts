// https://blog.mergify.com/content/images/size/w1000/2022/06/2-2.png

import { NextFunction, Request, Response } from "express";
import jwt, { AUTH_SECRET } from "./jwt";

import bcrypt from "bcrypt";
import crypto from "crypto";
import logger from "./logger";
import { prisma } from "..";

async function createUser(email: string, username: string, password: string) {
  if (
    !email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ||
    (await prisma.user.findUnique({ where: { email } })) != null
  )
    return "Not a valid email address";
  const hashedPassword = await hash(password);
  //const apiKey = await generateApiKey();
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, username },
  });
  return { user: sanitize(user) };
}

async function loginUser(email: string, password: string) {
  if (
    !email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    return "Not a valid email address";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return { error: "No user found" };

  if (await check(password, user.password)) {
    return {
      login: true,
      user: sanitize(user),
      apiKey: jwt.sign({ id: user.id }, AUTH_SECRET, { expiresIn: "24h" }),
    };
  }

  return "Wrong Password";
}

async function hash(toHash: string, rounds?: number) {
  return bcrypt.hash(toHash, rounds || 10);
}

async function check(toCheck: string, hash: string) {
  return bcrypt.compare(toCheck, hash);
}

async function verifyToken(
  req: Request,
  res: Response,
  permission: "anonym" | "admin" | "user",
  next: any,
  userId?: string
) {
  if (permission == "anonym") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  jwt.verify(token, AUTH_SECRET, async (err: any, auth: any) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        res.status(403).send({ error: "Token expired" });
        return;
      }
      res.status(403).send({ error: "Forbidden" });
      return;
    }
    if (permission == "user") {
      return next();
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id } });
    if (user?.admin) {
      return next();
    }

    if (userId) {
      if (user?.id == userId) return next();
    }

    res.status(403).send({ error: "Forbidde2n" });
    return;
  });
}

export function sanitize(
  toSanitize: any,
  options?: { permissions?: boolean; id?: boolean; relations?: boolean }
) {
  var res = JSON.parse(JSON.stringify(toSanitize));
  if (Array.isArray(res)) res = res.map((r) => sanitize(r, options));
  res.apiKey = undefined;
  res.password = undefined;
  if (options?.permissions) {
    res.admin = undefined;
  }
  if (options?.id) {
    res.id = undefined;
  }
  if (options?.relations) {
    res.vehicleId = undefined;
    res.vehicle = undefined;
  }
  return res;
}

export default { createUser, loginUser, hash, check, verifyToken };

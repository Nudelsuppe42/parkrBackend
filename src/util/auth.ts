// https://blog.mergify.com/content/images/size/w1000/2022/06/2-2.png

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
    return { error: "Not a valid email address" };
  const hashedPassword = await hash(password);
  const apiKey = await generateApiKey();
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, username, apiKey: apiKey.apiKey },
  });
  return { error: false, result: sanitize(user) };
}

async function loginUser(email: string, password: string) {
  if (
    !email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    return { error: "Not a valid email address" };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return { error: "No user found" };

  if (await check(password, user.password)) {
    return {
      error: false,
      result: { login: true, user: sanitize(user), apiKey: user.apiKey },
    };
  }

  return { error: "Wrong Password" };
}

async function generateApiKey() {
  const k = crypto.randomUUID();
  const h = await hash(k);

  return { apiKey: k, hashed: h };
}

async function hash(toHash: string, rounds?: number) {
  return bcrypt.hash(toHash, rounds || 10);
}

async function check(toCheck: string, hash: string) {
  return bcrypt.compare(toCheck, hash);
}

export function sanitize(toSanitize: any) {
  var res = JSON.parse(JSON.stringify(toSanitize));
  if (Array.isArray(res)) res = res.map((r) => sanitize(r));
  res.apiKey = undefined;
  res.password = undefined;
  return res;
}

export default { createUser, loginUser, generateApiKey, hash, check };

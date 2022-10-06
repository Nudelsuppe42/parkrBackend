// https://blog.mergify.com/content/images/size/w1000/2022/06/2-2.png

import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "..";

async function createUser(email: string, username: string, password: string) {
  if (
    !email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    return { error: "Not a valid email address" };
  const hashedPassword = await hash(password);
  prisma.user.create({ data: { email, password: hashedPassword, username } });
}

async function apiKey() {
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

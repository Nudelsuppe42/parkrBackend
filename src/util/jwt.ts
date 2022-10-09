import * as jwt from "jsonwebtoken";

export const AUTH_SECRET = process.env.AUTH_SECRET || "";

export default jwt;

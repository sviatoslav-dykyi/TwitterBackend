import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User, Token } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET";

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  //next - is how do you pass function to next handler

  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    return res.sendStatus(401);
  }

  // decode JWT token
  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken?.expiration < new Date()) {
      return res.status(401).json({ error: "API token expired" });
    }

    req.user = dbToken?.user;
  } catch (error) {
    return res.sendStatus(401);
  }

  // call next handler
  next();
}

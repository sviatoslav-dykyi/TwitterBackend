import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendEmailToken } from "../services/emailService";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET";

const router = Router();
const prisma = new PrismaClient();

// Generate a random 8 digit number as email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}

// Create user if it doesn't exists,
// generate the emailToken and send it to their email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  // generate an emailToken
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              email,
            },
          },
        },
      },
    });
    console.log("createToken", createToken);
    // TODO: send emailToken to user's email
    await sendEmailToken(email, emailToken);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong when creating token" });
  }
});

// Validate the emailToken,
// Generate a long-lived JWT token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;
  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });
  // checking: 1) token exists 2) it is valid 3) it is not expired 4) user is an owner of email
  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Token expired" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  // generate an API token
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: { type: "API", expiration, user: { connect: { email } } },
  });

  // invalidate emailToken
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: {
      valid: false,
    },
  });

  // generate JWT token
  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;

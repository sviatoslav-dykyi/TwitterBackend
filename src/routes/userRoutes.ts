import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/**
  Test with curl:

  curl -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Elon Musk\", \"email\": \"gog1@gmail.com\", \"username\": \"Main Gog1\"}" \
  http://localhost:3000/user/
 */
// Create user
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { email, name, username, bio: "Hello, I'm new on Twitter" },
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

// list users
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    //select: { id: true, name: true, image: true, bio: true },
  });
  res.json(allUsers);
});

// get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });
  res.json(user);
});

//update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Filed to update user" });
  }
});

/**
  Test with curl:

  curl -X DELETE \
  http://localhost:3000/user/1
 */
// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.user.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: "Filed to delete user" });
  }
});

export default router;
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Create Tweet
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    try {
        const newTweet = yield prisma.tweet.create({
            data: { content, image, userId: user.id },
            include: { user: true },
        });
        res.json(newTweet);
    }
    catch (error) {
        res.status(400).json({ error: "Error while creating new tweet" });
    }
}));
// list Tweet
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield prisma.tweet.findMany({
        include: {
            user: {
                select: { id: true, name: true, username: true, image: true },
            },
        },
    });
    res.json(allTweets);
}));
// get one Tweet
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("Query tweet with id: ", id);
    const tweet = yield prisma.tweet.findFirst({
        where: { id: Number(id) },
        include: { user: true },
    });
    if (!tweet) {
        return res.status(404).json({ error: "Tweet not found!" });
    }
    res.json(tweet);
}));
//update Tweet
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { content, image, impression } = req.body;
//   try {
//     const result = await prisma.tweet.update({
//       where: { id: Number(id) },
//       data: { content, image, impression: { increment: impression ? 1 : 0 } },
//     });
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ error: "Filed to update tweet" });
//   }
// });
// delete Tweet
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield prisma.tweet.delete({ where: { id: Number(id) } });
        res.sendStatus(200);
    }
    catch (error) {
        res.status(400).json({ error: "Filed to delete tweet" });
    }
}));
exports.default = router;

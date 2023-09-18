"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
// when app receive data it will automatically parse it to JSON but not to a string
// express.json() middleware puts parsed JSON data in req.body
app.use(express_1.default.json());
// mounting user router on to the application
// for all routes that starts with '/user' handle them using userRoutes
app.use("/user", authMiddleware_1.authenticateToken, userRoutes_1.default);
app.use("/tweet", authMiddleware_1.authenticateToken, tweetRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(3000, () => {
    console.log("Server ready at http://localhost:3000");
});

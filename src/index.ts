import express from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";

const app = express();
// when app receive data it will automatically parse it to JSON but not to a string
// express.json() middleware puts parsed JSON data in req.body
app.use(express.json());
// mounting user router on to the application
// for all routes that starts with '/user' handle them using userRoutes
app.use("/user", authenticateToken, userRoutes);
app.use("/tweet", authenticateToken, tweetRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server ready at http://localhost:3000");
});

import express from "express";
import * as dotenvx from "@dotenvx/dotenvx";
import cors from "cors";
import { authenticate } from "./middleware/auth.js";

import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import userRoutes from "./routes/user.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

dotenvx.config();

const app = express();
app.use(express.json());
app.use(cors());

// Public routes
app.use("/api/v2", authRoutes);

// Protected routes
app.use(authenticate);
app.use("/api/v2/game", gameRoutes);
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/leaderboard", leaderboardRoutes);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
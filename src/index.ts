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

    // try {
    //   const { data, error } = await supabaseAdmin.rpc("get_total_emails_today");

    //   if (error) {
    //     console.error("Database error:", error);
    //     return res.status(500).json({ error: "Database error" });
    //   }

    //   const { data: tot, error: error2 } = await supabaseAdmin
    //     .from("clients")
    //     .select("emails_required")
    //     .eq("is_active", true);

    //   if (error2) {
    //     return;
    //   }

    //   const totalRequired = tot.reduce((sum, client) => {
    //     return sum + (client.emails_required || 0);
    //   }, 0);
    //   const totalTasksDone = data ?? 0;

    //   return res.json({
    //     hp: (totalRequired as number) - totalTasksDone,
    //     total_hp: totalRequired,
    //   });
    // } catch (err) {
    //   console.error("Unexpected error:", err);
    //   return res.status(500).json({ error: "Unexpected server error" });
    // }

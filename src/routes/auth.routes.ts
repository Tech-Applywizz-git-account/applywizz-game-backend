import express from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../config/supabase.js";

const router = express.Router();

router.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      const { data: user } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("email", email)
        .single();

      const userId = user?.id;

      const role = user?.role;

      const token = jwt.sign(
        {
          userId: userId,
          role: role,
        },
        process.env.JWT_SECRET_KEY!,
      );

      res.json({
        token: token,
      });
    } catch (err) {
      res.status(500).json({ error: "Server error during signin" });
    }
  },
);

export default router;
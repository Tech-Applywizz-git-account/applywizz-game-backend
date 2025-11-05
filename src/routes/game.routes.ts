import express from "express";
import { supabaseAdmin } from "./../config/supabase.js";
import { formatLocalDate } from "../utils/date.js";

const router = express.Router();

router.get("/coinsxp", async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).payload.userId;
    const { data, error } = await supabaseAdmin
      .from("game_stats")
      .select("coins, xp")
      .eq("ca_id", userId)
      .single();

    console.log(data);
    if (error) {
      console.log("DB error:", error);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ coins: data?.coins || 0, xp: data?.xp || 0 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

router.post("/purchase", async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).payload.userId;

    const { item_name, item_type, item_cost } = req.body;

    const { data, error } = await supabaseAdmin
      .from("game_stats")
      .select("coins, xp")
      .eq("ca_id", userId)
      .single();
    if (error) {
      console.log("DB error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if ((data?.coins || 0) < item_cost) {
      return res.status(400).json({ error: "Insufficient coins" });
    }

    const { error: updateError } = await supabaseAdmin
      .from("game_stats")
      .update({ coins: (data?.coins || 0) - item_cost })
      .eq("ca_id", userId);

    if (updateError) {
      console.log("DB error:", updateError);
      return res.status(500).json({ error: "Database error" });
    }

    const date = formatLocalDate(new Date());

    const { error: insertError } = await supabaseAdmin
      .from("purchases")
      .insert({ ca_id: userId, item_name, item_type, purchased_at: date });

    if (insertError) {
      console.log("DB error:", insertError);
      return res.status(500).json({ error: "Database error" });
    }

    return res.json({
      message: "purchase done",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

router.get("/get-selected-avatar", async (req: express.Request, res: express.Response) => {
  const userId = (req as any).payload.userId;

  const { data, error } = await supabaseAdmin
    .from("game_stats")
    .select("avatar_id")
    .eq("ca_id", userId)
    .single();

  if (error) {
    return res.status(500).json({ error: "Database error" });
  }

  if (data === null) {
    return res.json({
      avatar: "Fighter",
    });
  }

  return res.json({
    avatar: data.avatar_id,
  });
});

router.get("/badge", async (req: express.Request, res: express.Response) => {
  const userId = (req as any).payload.userId;

  const { data, error } = await supabaseAdmin
    .from("game_stats")
    .select("streak, badge")
    .eq("ca_id", userId)
    .single();

  if (error) {
    return res.status(500).json({ error: "Database error" });
  }

  if (data === null) {
    return res.json({
      badge: null,
      streak: 0,
    });
  }

  return res.json({
    badge: data.badge || null,
    streak: data.streak || 0,
  });
});

router.get("/own", async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).payload.userId;

    const { data, error } = await supabaseAdmin
      .from("purchases")
      .select("item_name, item_type")
      .eq("ca_id", userId);

    if (error) {
      console.log("DB error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const items =
      data?.map((d) => ({ item_name: d.item_name, item_type: d.item_type })) ||
      [];

    return res.json({ items });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

router.post("/select-avatar", async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).payload.userId;
    const { item_name } = req.body;

    const { data, error } = await supabaseAdmin
      .from("game_stats")
      .update({ avatar_id: item_name })
      .eq("ca_id", userId);

    if (error) {
      console.error("DB error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});


export default router;
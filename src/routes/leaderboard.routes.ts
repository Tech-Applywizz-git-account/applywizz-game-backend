import express from "express";
import { supabaseAdmin } from "./../config/supabase.js";
import { formatLocalDate } from "../utils/date.js";

const router = express.Router();

router.get(
  "/team-hp",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).payload.userId as string;
      const { count: completed_clients, error } = await supabaseAdmin
        .from("clients")
        .select("*", { count: "exact", head: true }) 
        .eq("status", "Completed")
        .eq("is_active", true) ;

        const { count: total_clients , error: error2 } = await supabaseAdmin
        .from("clients")
        .select("*", { count: "exact", head: true }) 
        .eq("is_active", true) ;

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }

      const factor = 21

      let cc = completed_clients ?? 0;
      let tc = total_clients ?? 0;

      cc *= factor;
      tc *= factor;

      return res.json({ hp: cc, total_hp: tc });
    }
    catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  },
);

router.get("/top-four", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_top4_today");
    if (error) {
      console.error("Database err", error);
      return res.status(500).json({ error: "Database error" });
    }
    // data is [{ username: string }] from your RPC
    return res.json({
      users: data ?? [],
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

const leaderboardCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

router.get(
  "/leaderboard",
  async (req: express.Request, res: express.Response) => {
    try {
      const { data, type } = req.query;
      const dataParam = (data as string) || "today";
      const typeParam = (type as string) || "individual";

      const userId = (req as any).payload.userId as string;

      // Create cache key
      const cacheKey = `${dataParam}-${typeParam}-${userId ?? "anon"}`;

      if (dataParam === "today") {
        if (typeParam === "individual") {
        } else {
        }
      }

      // Check cache
      const cached = leaderboardCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }

      const now = new Date();
      let startDate: string;
      let endDate: string = formatLocalDate(now);

      // Calculate date range based on data parameter
      switch (dataParam) {
        case "today":
          startDate = endDate;
          break;
        case "week":
          const day = now.getDay(); // 0 (Sun) - 6 (Sat)
          const diff = day === 0 ? -6 : 1 - day; // Adjust to get Monday
          const monday = new Date(now);
          monday.setDate(now.getDate() + diff);
          startDate = formatLocalDate(monday);
          break;
        case "this_month":
          startDate = formatLocalDate(
            new Date(now.getFullYear(), now.getMonth(), 1),
          );
          break;
        case "all_time":
          startDate = "2025-01-01"; // Very old date to get all data
          break;
        default:
          startDate = endDate; // Default to today
      }

      let personalProgress = null;

      if (typeParam === "team") {
        const { data: teams, error } = await supabaseAdmin.rpc(
          "get_team_leaderboard",
          {
            start_date: startDate,
            end_date: endDate,
            lim: 100,
            off: 0,
          },
        );
        if (error) throw error;

        let personalProgress = null;
        if (userId) {
          const { data: pos } = await supabaseAdmin.rpc(
            "get_team_position_for_user",
            {
              target_user_id: userId,
              start_date: startDate,
              end_date: endDate,
            },
          );
          const p = pos?.[0];
          if (p) {
            personalProgress = {
              rank: p.rank,
              name: p.team_name,
              score: p.team_score,
              totalParticipants: p.total_teams,
            };
          }
        }

        const result = {
          teams: (teams ?? []).map((t) => ({
            team_name: t.team_name ?? "Unknown Team",
            team_score: t.team_score,
            rank: t.rnk,
          })),
        };

        leaderboardCache.set(cacheKey, {
          data: { ...result, personal_progress: personalProgress },
          timestamp: Date.now(),
        });

        return res.json({ ...result, personal_progress: personalProgress });
      } else {
        // Individual leaderboard

        const { data: individuals, error } = await supabaseAdmin.rpc(
          "get_individual_leaderboard",
          { start_date: startDate, end_date: endDate, lim: 100, off: 0 },
        );

        let personalProgress = null;
        if (userId) {
          const { data: me } = await supabaseAdmin.rpc(
            "get_individual_position",
            {
              target_user_id: userId,
              start_date: startDate,
              end_date: endDate,
            },
          );

          const pos = me?.[0];
          if (pos) {
            const username = (req as any).payload.name;
            personalProgress = {
              rank: pos.rank,
              name: username,
              score: pos.user_score,
              totalParticipants: pos.total_participants,
            };
          }
        }

        if (error) throw error;

        const result = {
          individuals: (individuals ?? []).map((i) => ({
            username: i.username ?? "Unknown",
            user_score: i.user_score,
            rank: i.rnk,
            badge: i.badge,
          })),
        };

        leaderboardCache.set(cacheKey, {
          data: { ...result, personal_progress: personalProgress },
          timestamp: Date.now(),
        });

        res.json({ ...result, personal_progress: personalProgress });
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/user-total-today", async (req, res) => {
  try {
    const userId = (req as any).payload.userId;
    const { data, error } = await supabaseAdmin.rpc(
      "get_total_emails_today_by_user",
      { p_user_id: userId },
    );
    if (error) return res.status(500).json({ error: "Database error" });

    const { data: total, error: err } = await supabaseAdmin.rpc(
      "get_user_emails_required",
      { p_user_id: userId },
    );

    if (err) {
      throw err;
    }

    console.log(data);

    return res.json({ hp: total - data, total_hp: total });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});


export default router;
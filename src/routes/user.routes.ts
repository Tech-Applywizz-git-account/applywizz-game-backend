import express from "express";
import { formatLocalDate } from "../utils/date.js";
import { supabaseAdmin } from "./../config/supabase.js";

const router = express.Router();

router.get(
  "/user-info",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).payload.userId;

      const { data, error } = await supabaseAdmin
        .from("users")
        .select("name, email, team_id")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }
      //
      const { data: team } = await supabaseAdmin
        .from("teams")
        .select("name")
        .eq("id", data.team_id as string)
        .maybeSingle();

      res.json({ username: data.name, email: data.email, team: team?.name });
      return;
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  },
);

router.get(
  "/tasks-info",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).payload.userId;

      const now = new Date();

      const today = formatLocalDate(now);
      const yesterday = formatLocalDate(
        new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      );

      const currentWeekStart = new Date(now);
      const dayOfWeek = currentWeekStart.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      currentWeekStart.setDate(currentWeekStart.getDate() - daysToMonday);
      const weekStart = formatLocalDate(currentWeekStart);

      const lastWeekStartDate = new Date(
        currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000,
      );
      const lastWeekEndDate = new Date(
        currentWeekStart.getTime() - 1 * 24 * 60 * 60 * 1000,
      );
      const lastWeekStart = formatLocalDate(lastWeekStartDate);
      const lastWeekEnd = formatLocalDate(lastWeekEndDate);

      const monthStart = formatLocalDate(
        new Date(now.getFullYear(), now.getMonth(), 1),
      );
      const lastMonthStart = formatLocalDate(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
      );
      const lastMonthEnd = formatLocalDate(
        new Date(now.getFullYear(), now.getMonth(), 0),
      );

      const { data: tasksInfo, error } = await supabaseAdmin.rpc(
        "get_emails_stats",
        {
          target_user_id: userId, // uuid
          today_date: today, // 'YYYY-MM-DD'
          yesterday_date: yesterday,
          week_start: weekStart, // Monday date you computed
          last_week_start: lastWeekStart,
          last_week_end: lastWeekEnd,
          month_start: monthStart,
          last_month_start: lastMonthStart,
          last_month_end: lastMonthEnd,
        },
      );

      if (error) throw error;

      const {
        todays_tasks,
        yesterdays_tasks,
        weeks_tasks,
        last_weeks_tasks,
        months_tasks,
        last_months_tasks,
        all_time_tasks,
      } = tasksInfo?.[0] ?? {
        todays_tasks: 0,
        yesterdays_tasks: 0,
        weeks_tasks: 0,
        last_weeks_tasks: 0,
        months_tasks: 0,
        last_months_tasks: 0,
        all_time_tasks: 0,
      };

      const progress =
        yesterdays_tasks > 0
          ? Math.max(
            0,
            ((todays_tasks - yesterdays_tasks) / yesterdays_tasks) * 100,
          )
          : 0;

      const weeks_progress =
        last_weeks_tasks > 0
          ? Math.max(
            0,
            ((weeks_tasks - last_weeks_tasks) / last_weeks_tasks) * 100,
          )
          : 0;

      const months_progress =
        last_months_tasks > 0
          ? Math.max(
            0,
            ((months_tasks - last_months_tasks) / last_months_tasks) * 100,
          )
          : 0;

      res.json({
        todays_tasks,
        progress,
        weeks_tasks,
        weeks_progress,
        months_tasks,
        months_progress,
        all_time_tasks,
      });
    } catch (err) {
      console.error("Unhandled error in /tasks-info:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get(
  "/user-graph",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).payload.userId; // keep your current source
      const { data } = req.query;
      const dataParam = (data as string) || "week";

      const now = new Date();

      if (dataParam === "week") {
        const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        const startDate = formatLocalDate(weekAgo);

        const { data: weekData, error } = await supabaseAdmin.rpc(
          "get_user_graph_week",
          { target_user_id: userId, start_date: startDate },
        );

        if (error) throw error;

        const user_data = (weekData ?? []).map((item: any) => ({
          date: item.date, // 'YYYY-MM-DD'
          tasks: item.tasks, // number
        }));

        return res.json({ user_data });
      }

      if (dataParam === "30days") {
        const thirtyDaysAgo = new Date(
          now.getTime() - 29 * 24 * 60 * 60 * 1000,
        );
        const startDate = formatLocalDate(thirtyDaysAgo);

        const { data: thirtyDaysData, error } = await supabaseAdmin.rpc(
          "get_user_graph_30days",
          { target_user_id: userId, start_date: startDate },
        );

        if (error) throw error;

        const user_data = (thirtyDaysData ?? []).map((item: any) => ({
          date: item.date, // bucket end date 'YYYY-MM-DD'
          tasks: item.tasks, // number
        }));

        return res.json({ user_data });
      }

      if (dataParam === "all_time") {
        const { data: monthlyData, error } = await supabaseAdmin.rpc(
          "get_user_graph_all_time",
          { target_user_id: userId },
        );

        if (error) throw error;

        const user_data = (monthlyData ?? []).map((item: any) => ({
          month: item.month, // 'YYYY-MM'
          tasks: item.tasks, // number
        }));

        return res.json({ user_data });
      }

      return res.status(400).json({ error: "Invalid data parameter" });
    } catch (error) {
      console.error("Error fetching user graph data:", error);
      // keep response shape stable
      if (req.query.data === "all_time") {
        return res.json({
          user_data: [] as Array<{ month: string; tasks: number }>,
        });
      }
      return res.json({
        user_data: [] as Array<{ date: string; tasks: number }>,
      });
    }
  },
);


export default router;
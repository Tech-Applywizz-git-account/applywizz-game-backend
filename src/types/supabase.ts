export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          applywizz_id: string | null
          assigned_ca_id: string | null
          assigned_ca_name: string | null
          client_designation: string | null
          created_at: string | null
          date: string | null
          date_assigned: string | null
          email: string
          emails_required: number | null
          emails_submitted: number | null
          end_time: string | null
          experience: number | null
          id: string
          is_active: boolean | null
          jobs_applied: number | null
          last_update: string | null
          name: string | null
          remarks: string | null
          sponsorship: boolean | null
          start_time: string | null
          status: string | null
          team_id: string | null
          team_lead_name: string | null
          visa_type: string | null
          work_auth_details: string | null
          work_done_by: string | null
        }
        Insert: {
          applywizz_id?: string | null
          assigned_ca_id?: string | null
          assigned_ca_name?: string | null
          client_designation?: string | null
          created_at?: string | null
          date?: string | null
          date_assigned?: string | null
          email: string
          emails_required?: number | null
          emails_submitted?: number | null
          end_time?: string | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          jobs_applied?: number | null
          last_update?: string | null
          name?: string | null
          remarks?: string | null
          sponsorship?: boolean | null
          start_time?: string | null
          status?: string | null
          team_id?: string | null
          team_lead_name?: string | null
          visa_type?: string | null
          work_auth_details?: string | null
          work_done_by?: string | null
        }
        Update: {
          applywizz_id?: string | null
          assigned_ca_id?: string | null
          assigned_ca_name?: string | null
          client_designation?: string | null
          created_at?: string | null
          date?: string | null
          date_assigned?: string | null
          email?: string
          emails_required?: number | null
          emails_submitted?: number | null
          end_time?: string | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          jobs_applied?: number | null
          last_update?: string | null
          name?: string | null
          remarks?: string | null
          sponsorship?: boolean | null
          start_time?: string | null
          status?: string | null
          team_id?: string | null
          team_lead_name?: string | null
          visa_type?: string | null
          work_auth_details?: string | null
          work_done_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_ca_id_fkey"
            columns: ["assigned_ca_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_work_done_by_fkey"
            columns: ["work_done_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_stats: {
        Row: {
          avatar_id: string | null
          ca_id: string
          coins: number
          streak: number
          xp: number
        }
        Insert: {
          avatar_id?: string | null
          ca_id?: string
          coins?: number
          streak?: number
          xp?: number
        }
        Update: {
          avatar_id?: string | null
          ca_id?: string
          coins?: number
          streak?: number
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_stats_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }

      purchases: {
        Row: {
          id: string,
          ca_id: string,
          item_name: string,
          item_type: string,
          purchased_at: string  
        }
        Insert: {
          id?: string
          ca_id?: string
          item_name?: string
          item_type?: string
          purchased_at?: string 
        }
        Update: {
          id?: string
          ca_id?: string
          item_name?: string
          item_type?: string
          purchased_at?: string 
        }
        Relationships: [
          {
            foreignKeyName: "purchases_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }

      incentives: {
        Row: {
          badge: string | null
          created_at: string | null
          incentive_amount: number | null
          month: string | null
          total_clients_completed: number | null
          total_emails: number | null
          total_jobs: number | null
          user_id: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          incentive_amount?: number | null
          month?: string | null
          total_clients_completed?: number | null
          total_emails?: number | null
          total_jobs?: number | null
          user_id?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          incentive_amount?: number | null
          month?: string | null
          total_clients_completed?: number | null
          total_emails?: number | null
          total_jobs?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incentives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_checks: {
        Row: {
          created_at: string
          id: string
          issue_found: boolean
          remarks: string | null
          work_log_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_found?: boolean
          remarks?: string | null
          work_log_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_found?: boolean
          remarks?: string | null
          work_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_checks_work_log_id_fkey"
            columns: ["work_log_id"]
            isOneToOne: false
            referencedRelation: "work_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          amount_coins: number
          amount_xp: number
          ca_id: string
          day: string
          id: string
          kind: string
        }
        Insert: {
          amount_coins?: number
          amount_xp?: number
          ca_id: string
          day: string
          id?: string
          kind: string
        }
        Update: {
          amount_coins?: number
          amount_xp?: number
          ca_id?: string
          day?: string
          id?: string
          kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          base_salary: number | null
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          id: string
          isactive: boolean | null
          name: string | null
          role: string | null
          team_id: string | null
        }
        Insert: {
          base_salary?: number | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          id?: string
          isactive?: boolean | null
          name?: string | null
          role?: string | null
          team_id?: string | null
        }
        Update: {
          base_salary?: number | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          id?: string
          isactive?: boolean | null
          name?: string | null
          role?: string | null
          team_id?: string | null
        }
        Relationships: []
      }
      work_history: {
        Row: {
          ca_id: string | null
          ca_name: string | null
          completed_profiles: Json | null
          date: string | null
          id: string
          incentives: number | null
        }
        Insert: {
          ca_id?: string | null
          ca_name?: string | null
          completed_profiles?: Json | null
          date?: string | null
          id?: string
          incentives?: number | null
        }
        Update: {
          ca_id?: string | null
          ca_name?: string | null
          completed_profiles?: Json | null
          date?: string | null
          id?: string
          incentives?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      work_logs: {
        Row: {
          client_id: string | null
          created_at: string | null
          date: string | null
          emails_submitted: number | null
          id: string
          jobs_applied: number | null
          remarks: string | null
          status: string | null
          work_done_by: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          emails_submitted?: number | null
          id?: string
          jobs_applied?: number | null
          remarks?: string | null
          status?: string | null
          work_done_by?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          emails_submitted?: number | null
          id?: string
          jobs_applied?: number | null
          remarks?: string | null
          status?: string | null
          work_done_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_logs_work_done_by_fkey"
            columns: ["work_done_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_profile_emails: {
        Row: {
          emails_submitted: number | null
          work_date: string | null
          work_doneby: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_ca_id_fkey"
            columns: ["work_doneby"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_emails_all: {
        Row: {
          emails_submitted: number | null
          work_date: string | null
          work_doneby: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_emails_stats: {
        Args: {
          last_month_end: string
          last_month_start: string
          last_week_end: string
          last_week_start: string
          month_start: string
          target_user_id: string
          today_date: string
          week_start: string
          yesterday_date: string
        }
        Returns: {
          all_time_tasks: number
          last_months_tasks: number
          last_weeks_tasks: number
          months_tasks: number
          todays_tasks: number
          weeks_tasks: number
          yesterdays_tasks: number
        }[]
      }
      get_individual_leaderboard: {
        Args:
          | Record<PropertyKey, never>
          | { end_date: string; lim?: number; off?: number; start_date: string }
        Returns: {
          rnk: number
          user_score: number
          username: string
        }[]
      }
      get_individual_leaderboard_in_team: {
        Args: {
          end_date: string
          lim?: number
          off?: number
          start_date: string
          target_team_name: string
        }
        Returns: {
          rnk: number
          user_score: number
          username: string
        }[]
      }
      get_individual_position: {
        Args:
          | { end_date: string; start_date: string; target_user_id: string }
          | { user_id: string }
        Returns: {
          rank: number
          total_participants: number
          user_score: number
        }[]
      }
      get_team_leaderboard: {
        Args:
          | Record<PropertyKey, never>
          | { end_date: string; lim?: number; off?: number; start_date: string }
        Returns: {
          rnk: number
          team_name: string
          team_score: number
        }[]
      }
      get_team_position_for_user: {
        Args:
          | { end_date: string; start_date: string; target_user_id: string }
          | { user_id: string }
        Returns: {
          rank: number
          team_name: string
          team_score: number
          total_teams: number
        }[]
      }
      get_top4_today: {
        Args: Record<PropertyKey, never>
        Returns: {
          username: string
        }[]
      }
      get_total_emails_today: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_emails_today_by_user: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_emails_required: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_graph_30days: {
        Args: { start_date: string; target_user_id: string }
        Returns: {
          date: string
          tasks: number
        }[]
      }
      get_user_graph_all_time: {
        Args: { target_user_id: string }
        Returns: {
          month: string
          tasks: number
        }[]
      }
      get_user_graph_week: {
        Args: { start_date: string; target_user_id: string }
        Returns: {
          date: string
          tasks: number
        }[]
      }
      run_daily_cron: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      fitness_trends: {
        Row: {
          id: string
          snapshot_id: string
          streak_weeks: number | null
          total_distance_km: number | null
          total_elevation_m: number | null
          total_energy_kj: number | null
          weekly_goal_km: number | null
          weekly_progress_km: number | null
          weekly_this_ride_km: number | null
        }
        Insert: {
          id?: string
          snapshot_id: string
          streak_weeks?: number | null
          total_distance_km?: number | null
          total_elevation_m?: number | null
          total_energy_kj?: number | null
          weekly_goal_km?: number | null
          weekly_progress_km?: number | null
          weekly_this_ride_km?: number | null
        }
        Update: {
          id?: string
          snapshot_id?: string
          streak_weeks?: number | null
          total_distance_km?: number | null
          total_elevation_m?: number | null
          total_energy_kj?: number | null
          weekly_goal_km?: number | null
          weekly_progress_km?: number | null
          weekly_this_ride_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fitness_trends_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: true
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          best_1m_w: number | null
          best_20m_w: number | null
          best_5m_w: number | null
          best_5s_w: number | null
          ftp_w: number | null
          id: string
          racing_score: number | null
          snapshot_id: string
        }
        Insert: {
          best_1m_w?: number | null
          best_20m_w?: number | null
          best_5m_w?: number | null
          best_5s_w?: number | null
          ftp_w?: number | null
          id?: string
          racing_score?: number | null
          snapshot_id: string
        }
        Update: {
          best_1m_w?: number | null
          best_20m_w?: number | null
          best_5m_w?: number | null
          best_5s_w?: number | null
          ftp_w?: number | null
          id?: string
          racing_score?: number | null
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: true
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_report_metrics: {
        Row: {
          achievements_current: number | null
          achievements_target: number | null
          challenge_name: string | null
          challenge_progress_km: number | null
          challenge_stage_current: number | null
          challenge_stage_target: number | null
          challenge_target_km: number | null
          challenge_this_ride_km: number | null
          id: string
          level: number | null
          route_badges_current: number | null
          route_badges_target: number | null
          snapshot_id: string
          this_ride_xp: number | null
          xp_current: number | null
          xp_target: number | null
        }
        Insert: {
          achievements_current?: number | null
          achievements_target?: number | null
          challenge_name?: string | null
          challenge_progress_km?: number | null
          challenge_stage_current?: number | null
          challenge_stage_target?: number | null
          challenge_target_km?: number | null
          challenge_this_ride_km?: number | null
          id?: string
          level?: number | null
          route_badges_current?: number | null
          route_badges_target?: number | null
          snapshot_id: string
          this_ride_xp?: number | null
          xp_current?: number | null
          xp_target?: number | null
        }
        Update: {
          achievements_current?: number | null
          achievements_target?: number | null
          challenge_name?: string | null
          challenge_progress_km?: number | null
          challenge_stage_current?: number | null
          challenge_stage_target?: number | null
          challenge_target_km?: number | null
          challenge_this_ride_km?: number | null
          id?: string
          level?: number | null
          route_badges_current?: number | null
          route_badges_target?: number | null
          snapshot_id?: string
          this_ride_xp?: number | null
          xp_current?: number | null
          xp_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_report_metrics_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: true
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      snapshots: {
        Row: {
          captured_at: string | null
          created_at: string
          id: string
          image_hash: string | null
          image_url: string | null
          metadata_json: Json | null
          overall_confidence: number | null
          parsed_data_json: Json | null
          raw_extraction_json: Json | null
          screen_type: string
          source: string
          timezone_offset_minutes: number | null
        }
        Insert: {
          captured_at?: string | null
          created_at?: string
          id?: string
          image_hash?: string | null
          image_url?: string | null
          metadata_json?: Json | null
          overall_confidence?: number | null
          parsed_data_json?: Json | null
          raw_extraction_json?: Json | null
          screen_type?: string
          source?: string
          timezone_offset_minutes?: number | null
        }
        Update: {
          captured_at?: string | null
          created_at?: string
          id?: string
          image_hash?: string | null
          image_url?: string | null
          metadata_json?: Json | null
          overall_confidence?: number | null
          parsed_data_json?: Json | null
          raw_extraction_json?: Json | null
          screen_type?: string
          source?: string
          timezone_offset_minutes?: number | null
        }
        Relationships: []
      }
      training_status: {
        Row: {
          freshness_state: string | null
          id: string
          snapshot_id: string
          training_score: number | null
          training_score_delta: number | null
        }
        Insert: {
          freshness_state?: string | null
          id?: string
          snapshot_id: string
          training_score?: number | null
          training_score_delta?: number | null
        }
        Update: {
          freshness_state?: string | null
          id?: string
          snapshot_id?: string
          training_score?: number | null
          training_score_delta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_status_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: true
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const

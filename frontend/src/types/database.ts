export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: {
      subscription_plan: "free" | "pro";
      subscription_status: "inactive" | "trialing" | "active" | "past_due" | "canceled";
    };
    Functions: Record<string, never>;
    Tables: {
      exercises: {
        Insert: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          notes?: string | null;
          order_index?: number;
          plan_id: string;
          reps?: number | null;
          rest_seconds?: number | null;
          sets?: number | null;
          target?: string | null;
          updated_at?: string;
          user_id: string;
          video_url?: string | null;
          weight?: number | null;
        };
        Row: {
          body_part: string | null;
          catalog_id: string | null;
          catalog_internal_id: number | null;
          created_at: string;
          equipment: string | null;
          gif_url: string | null;
          id: string;
          image_url: string | null;
          name: string;
          notes: string | null;
          order_index: number;
          plan_id: string;
          reps: number | null;
          rest_seconds: number | null;
          sets: number | null;
          target: string | null;
          updated_at: string;
          user_id: string;
          video_url: string | null;
          weight: number | null;
        };
        Update: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          notes?: string | null;
          order_index?: number;
          plan_id?: string;
          reps?: number | null;
          rest_seconds?: number | null;
          sets?: number | null;
          target?: string | null;
          updated_at?: string;
          user_id?: string;
          video_url?: string | null;
          weight?: number | null;
        };
      };
      habit_logs: {
        Insert: {
          completed_on: string;
          created_at?: string;
          habit_id: string;
          id?: string;
          notes?: string | null;
          user_id: string;
        };
        Row: {
          completed_on: string;
          created_at: string;
          habit_id: string;
          id: string;
          notes: string | null;
          user_id: string;
        };
        Update: {
          completed_on?: string;
          created_at?: string;
          habit_id?: string;
          id?: string;
          notes?: string | null;
          user_id?: string;
        };
      };
      habits: {
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          description?: string | null;
          frequency_per_week?: number;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Row: {
          archived_at: string | null;
          created_at: string;
          description: string | null;
          frequency_per_week: number;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          description?: string | null;
          frequency_per_week?: number;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      profiles: {
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          timezone?: string;
          updated_at?: string;
        };
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          timezone: string;
          updated_at: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          timezone?: string;
          updated_at?: string;
        };
      };
      focus_runs: {
        Insert: {
          cycles_completed?: number;
          created_at?: string;
          duration_seconds: number;
          ended_at?: string;
          id?: string;
          source?: string;
          started_at?: string;
          status?: string;
          study_session_id?: string | null;
          user_id: string;
        };
        Row: {
          cycles_completed: number;
          created_at: string;
          duration_seconds: number;
          ended_at: string;
          id: string;
          source: string;
          started_at: string;
          status: string;
          study_session_id: string | null;
          user_id: string;
        };
        Update: {
          cycles_completed?: number;
          created_at?: string;
          duration_seconds?: number;
          ended_at?: string;
          id?: string;
          source?: string;
          started_at?: string;
          status?: string;
          study_session_id?: string | null;
          user_id?: string;
        };
      };
      study_sessions: {
        Insert: {
          created_at?: string;
          difficulty?: string;
          duration_minutes?: number | null;
          due_date?: string;
          ended_at?: string | null;
          estimated_minutes?: number;
          id?: string;
          importance?: string;
          notes?: string | null;
          started_at?: string;
          status?: string;
          subject?: string | null;
          title: string;
          user_id: string;
        };
        Row: {
          created_at: string;
          difficulty: string;
          duration_minutes: number | null;
          due_date: string;
          ended_at: string | null;
          estimated_minutes: number;
          id: string;
          importance: string;
          notes: string | null;
          started_at: string;
          status: string;
          subject: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          difficulty?: string;
          duration_minutes?: number | null;
          due_date?: string;
          ended_at?: string | null;
          estimated_minutes?: number;
          id?: string;
          importance?: string;
          notes?: string | null;
          started_at?: string;
          status?: string;
          subject?: string | null;
          title?: string;
          user_id?: string;
        };
      };
      subscriptions: {
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Row: {
          created_at: string;
          current_period_end: string | null;
          plan: Database["public"]["Enums"]["subscription_plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
      };
      workout_log_exercises: {
        Insert: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          notes?: string | null;
          order_index?: number;
          reps_completed?: number | null;
          rest_seconds?: number | null;
          sets_completed?: number | null;
          target?: string | null;
          user_id: string;
          video_url?: string | null;
          weight?: number | null;
          workout_log_id: string;
        };
        Row: {
          body_part: string | null;
          catalog_id: string | null;
          catalog_internal_id: number | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          equipment: string | null;
          gif_url: string | null;
          id: string;
          image_url: string | null;
          name: string;
          notes: string | null;
          order_index: number;
          reps_completed: number | null;
          rest_seconds: number | null;
          sets_completed: number | null;
          target: string | null;
          user_id: string;
          video_url: string | null;
          weight: number | null;
          workout_log_id: string;
        };
        Update: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          notes?: string | null;
          order_index?: number;
          reps_completed?: number | null;
          rest_seconds?: number | null;
          sets_completed?: number | null;
          target?: string | null;
          user_id?: string;
          video_url?: string | null;
          weight?: number | null;
          workout_log_id?: string;
        };
      };
      workout_session_exercises: {
        Insert: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          notes?: string | null;
          order_index?: number;
          reps?: number | null;
          rest_seconds?: number | null;
          sets?: number | null;
          target?: string | null;
          updated_at?: string;
          user_id: string;
          video_url?: string | null;
          weight?: number | null;
          workout_plan_exercise_id?: string | null;
          workout_session_id: string;
        };
        Row: {
          body_part: string | null;
          catalog_id: string | null;
          catalog_internal_id: number | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          equipment: string | null;
          gif_url: string | null;
          id: string;
          image_url: string | null;
          name: string;
          notes: string | null;
          order_index: number;
          reps: number | null;
          rest_seconds: number | null;
          sets: number | null;
          target: string | null;
          updated_at: string;
          user_id: string;
          video_url: string | null;
          weight: number | null;
          workout_plan_exercise_id: string | null;
          workout_session_id: string;
        };
        Update: {
          body_part?: string | null;
          catalog_id?: string | null;
          catalog_internal_id?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          equipment?: string | null;
          gif_url?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          notes?: string | null;
          order_index?: number;
          reps?: number | null;
          rest_seconds?: number | null;
          sets?: number | null;
          target?: string | null;
          updated_at?: string;
          user_id?: string;
          video_url?: string | null;
          weight?: number | null;
          workout_plan_exercise_id?: string | null;
          workout_session_id?: string;
        };
      };
      workout_sessions: {
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id: string;
          workout_log_id?: string | null;
          workout_plan_id: string;
        };
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          started_at: string;
          status: string;
          updated_at: string;
          user_id: string;
          workout_log_id: string | null;
          workout_plan_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
          workout_log_id?: string | null;
          workout_plan_id?: string;
        };
      };
      workout_logs: {
        Insert: {
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          notes?: string | null;
          performed_at?: string;
          plan_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Row: {
          created_at: string;
          duration_minutes: number | null;
          id: string;
          notes: string | null;
          performed_at: string;
          plan_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          notes?: string | null;
          performed_at?: string;
          plan_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
      };
      workout_plans: {
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
  };
};

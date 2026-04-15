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
          created_at?: string;
          id?: string;
          name: string;
          order_index?: number;
          plan_id: string;
          reps?: number | null;
          sets?: number | null;
          updated_at?: string;
          user_id: string;
          weight?: number | null;
        };
        Row: {
          created_at: string;
          id: string;
          name: string;
          order_index: number;
          plan_id: string;
          reps: number | null;
          sets: number | null;
          updated_at: string;
          user_id: string;
          weight: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order_index?: number;
          plan_id?: string;
          reps?: number | null;
          sets?: number | null;
          updated_at?: string;
          user_id?: string;
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
      study_sessions: {
        Insert: {
          created_at?: string;
          duration_minutes?: number | null;
          ended_at?: string | null;
          id?: string;
          notes?: string | null;
          started_at?: string;
          subject?: string | null;
          user_id: string;
        };
        Row: {
          created_at: string;
          duration_minutes: number | null;
          ended_at: string | null;
          id: string;
          notes: string | null;
          started_at: string;
          subject: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number | null;
          ended_at?: string | null;
          id?: string;
          notes?: string | null;
          started_at?: string;
          subject?: string | null;
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

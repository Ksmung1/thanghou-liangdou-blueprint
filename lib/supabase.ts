import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: string;
          display_name: string;
          rating: number;
          review_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          display_name: string;
          rating: number;
          review_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          rating?: number;
          review_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      investment_projects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string;
          total_target_lakh: number;
          equity_percent_open: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          summary: string;
          total_target_lakh?: number;
          equity_percent_open?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          summary?: string;
          total_target_lakh?: number;
          equity_percent_open?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      investment_contributions: {
        Row: {
          id: string;
          project_id: string;
          investor_name: string;
          amount_lakh: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          investor_name: string;
          amount_lakh: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          investor_name?: string;
          amount_lakh?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const sharedOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};

let browserClient: SupabaseClient<Database> | undefined;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createClient<Database>(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
      requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", supabaseKey),
      sharedOptions,
    );
  }

  return browserClient;
}

export function getSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
    requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", supabaseKey),
    sharedOptions,
  );
}

export function getSupabaseAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey),
    sharedOptions,
  );
}

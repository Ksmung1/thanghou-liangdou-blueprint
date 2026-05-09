"use client";

import { useEffect, useState } from "react";
import InvestmentList from "./InvestmentList";
import {
  buildInvestmentProjects,
  INVESTMENT_SCHEMA_SETUP_MESSAGE,
  isMissingInvestmentSchemaError,
  type InvestmentProject,
} from "../lib/investments";
import { getSupabaseBrowserClient, type Database } from "../lib/supabase";

type InvestmentSectionProps = {
  initialProjects: InvestmentProject[];
  initialError: string | null;
};

type ProjectRow = Database["public"]["Tables"]["investment_projects"]["Row"];
type ContributionRow =
  Database["public"]["Tables"]["investment_contributions"]["Row"];

export default function InvestmentSection({
  initialProjects,
  initialError,
}: InvestmentSectionProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(initialProjects.length === 0);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    let cancelled = false;

    async function loadInvestments() {
      const [projectResult, contributionResult] = await Promise.all([
        supabase
          .from("investment_projects")
          .select(
            "id, slug, name, summary, total_target_lakh, equity_percent_open, sort_order, created_at",
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("investment_contributions")
          .select("id, project_id, investor_name, amount_lakh, created_at, updated_at")
          .order("updated_at", { ascending: false }),
      ]);

      if (cancelled) {
        return;
      }

      if (projectResult.error || contributionResult.error) {
        const message =
          projectResult.error?.message ??
          contributionResult.error?.message ??
          "Unable to load investments.";

        setError(
          isMissingInvestmentSchemaError(message)
            ? INVESTMENT_SCHEMA_SETUP_MESSAGE
            : message,
        );
        setLoading(false);
        return;
      }

      setProjects(
        buildInvestmentProjects(
          (projectResult.data as ProjectRow[] | null) ?? [],
          (contributionResult.data as ContributionRow[] | null) ?? [],
        ),
      );
      setLoading(false);
    }

    void loadInvestments();

    const channel = supabase
      .channel("public:investments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "investment_contributions" },
        () => {
          void loadInvestments();
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setError("Realtime investment updates failed. Refresh to retry.");
        }
      });

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading && projects.length === 0 && !error) {
    return <div className="investment-state">Loading investment data...</div>;
  }

  return <InvestmentList projects={projects} error={error} />;
}

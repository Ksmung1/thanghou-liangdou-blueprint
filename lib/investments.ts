import type { Database } from "./supabase";

type InvestmentProjectRow =
  Database["public"]["Tables"]["investment_projects"]["Row"];
type InvestmentContributionRow =
  Database["public"]["Tables"]["investment_contributions"]["Row"];

export type InvestmentProject = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  totalTargetLakh: number;
  equityPercentOpen: number;
  sortOrder: number;
  committedLakh: number;
  committedPercent: number;
  remainingLakh: number;
  remainingPercent: number;
  investors: Array<{
    id: string;
    investorName: string;
    amountLakh: number;
    updatedAt: string;
  }>;
};

export type InvestmentProjectInput = {
  projectId: string;
  investorName: string;
  amountLakh: number;
};

export const INVESTMENT_SCHEMA_SETUP_MESSAGE =
  "Investment tables are not set up in Supabase yet. Run supabase/investments-setup.sql in the Supabase SQL Editor, then reload the schema cache.";

export function isMissingInvestmentSchemaError(
  message: string | null | undefined,
): boolean {
  if (!message) {
    return false;
  }

  const lower = message.toLowerCase();

  return (
    lower.includes("public.investment_projects") ||
    lower.includes("public.investment_contributions") ||
    lower.includes("schema cache") ||
    lower.includes("does not exist")
  );
}

export function validateInvestmentInput(
  input: InvestmentProjectInput,
): { data: InvestmentProjectInput | null; error: string | null } {
  const projectId = input.projectId.trim();
  const investorName = input.investorName.trim();
  const amountLakh = Number(input.amountLakh);

  if (!projectId) {
    return { data: null, error: "Project is required." };
  }

  if (!investorName) {
    return { data: null, error: "Investor name is required." };
  }

  if (investorName.length > 80) {
    return { data: null, error: "Investor name must be 80 characters or less." };
  }

  if (!Number.isFinite(amountLakh) || amountLakh <= 0) {
    return { data: null, error: "Amount must be greater than 0." };
  }

  if (amountLakh > 10) {
    return { data: null, error: "Amount cannot exceed 10 lakh for a single record." };
  }

  return {
    data: {
      projectId,
      investorName,
      amountLakh: Number(amountLakh.toFixed(2)),
    },
    error: null,
  };
}

export function buildInvestmentProjects(
  projectRows: InvestmentProjectRow[],
  contributionRows: InvestmentContributionRow[],
): InvestmentProject[] {
  return [...projectRows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((project) => {
      const investors = contributionRows
        .filter((item) => item.project_id === project.id)
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .map((item) => ({
          id: item.id,
          investorName: item.investor_name,
          amountLakh: item.amount_lakh,
          updatedAt: item.updated_at,
        }));

      const committedLakh = Number(
        investors
          .reduce((total, item) => total + item.amountLakh, 0)
          .toFixed(2),
      );
      const committedPercent = Math.min(
        project.equity_percent_open,
        Number(
          ((committedLakh / project.total_target_lakh) * project.equity_percent_open)
            .toFixed(2),
        ),
      );
      const remainingLakh = Math.max(
        0,
        Number((project.total_target_lakh - committedLakh).toFixed(2)),
      );
      const remainingPercent = Math.max(
        0,
        Number((project.equity_percent_open - committedPercent).toFixed(2)),
      );

      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        summary: project.summary,
        totalTargetLakh: project.total_target_lakh,
        equityPercentOpen: project.equity_percent_open,
        sortOrder: project.sort_order,
        committedLakh,
        committedPercent,
        remainingLakh,
        remainingPercent,
        investors,
      };
    });
}

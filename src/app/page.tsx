import InvestmentSection from "../../components/InvestmentSection";
import ReviewsSection from "../../components/ReviewsSection";
import {
  buildInvestmentProjects,
  INVESTMENT_SCHEMA_SETUP_MESSAGE,
  isMissingInvestmentSchemaError,
  type InvestmentProject,
} from "../../lib/investments";
import ThangbouBlueprint from "./thangbou-blueprint";
import { mapReviewRows, type Review } from "../../lib/reviews";
import { getSupabaseServerClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

async function getInitialReviews(): Promise<{
  reviews: Review[];
  error: string | null;
}> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("id, display_name, rating, review_text, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      return {
        reviews: [],
        error: error.message,
      };
    }

    return {
      reviews: mapReviewRows(data ?? []),
      error: null,
    };
  } catch (error) {
    return {
      reviews: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load reviews right now.",
    };
  }
}

async function getInitialInvestmentProjects(): Promise<{
  projects: InvestmentProject[];
  error: string | null;
}> {
  try {
    const supabase = getSupabaseServerClient();
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

    if (projectResult.error || contributionResult.error) {
      const message =
        projectResult.error?.message ??
        contributionResult.error?.message ??
        "Unable to load investment data right now.";

      return {
        projects: [],
        error: isMissingInvestmentSchemaError(message)
          ? INVESTMENT_SCHEMA_SETUP_MESSAGE
          : message,
      };
    }

    return {
      projects: buildInvestmentProjects(
        projectResult.data ?? [],
        contributionResult.data ?? [],
      ),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load investment data right now.";

    return {
      projects: [],
      error: isMissingInvestmentSchemaError(message)
        ? INVESTMENT_SCHEMA_SETUP_MESSAGE
        : message,
    };
  }
}

export default async function Home() {
  const { reviews, error } = await getInitialReviews();
  const { projects, error: investmentError } =
    await getInitialInvestmentProjects();

  return (
    <>
      <ThangbouBlueprint />
      <section className="homepage-investment-wrap" id="investment-open">
        <InvestmentSection
          initialProjects={projects}
          initialError={investmentError}
        />
      </section>
      <section className="homepage-reviews-wrap" id="reviews">
        <div className="homepage-reviews-head">
          <p className="homepage-reviews-kicker">Reviews</p>
          <h2>Latest feedback from readers and visitors.</h2>
          <p>
            New reviews are anonymous by default, appear in realtime, and only
            the latest three are shown here.
          </p>
        </div>
        <ReviewsSection
          initialReviews={reviews}
          initialError={error}
          listTitle="Latest 3 reviews"
          listDescription="This section shows the newest three reviews on the main app page."
          emptyMessage="No reviews yet. Be the first to leave one."
          limit={3}
          moreHref="/reviews"
          moreLabel="See all reviews"
        />
      </section>
    </>
  );
}

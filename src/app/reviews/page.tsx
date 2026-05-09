import Link from "next/link";
import ReviewsSection from "../../../components/ReviewsSection";
import { mapReviewRows, type Review } from "../../../lib/reviews";
import { getSupabaseServerClient } from "../../../lib/supabase";

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
      .order("created_at", { ascending: false });

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

export default async function ReviewsPage() {
  const { reviews, error } = await getInitialReviews();

  return (
    <main className="reviews-page">
      <nav className="reviews-nav" aria-label="Reviews navigation">
        <Link className="reviews-nav-link" href="/">
          Back to home
        </Link>
        <span className="reviews-nav-current">Reviews</span>
      </nav>

      <header className="page-header">
        <h1>All reviews</h1>
        <p className="page-subtitle">
          Submit anonymous reviews and see new feedback appear instantly.
        </p>
      </header>

      <ReviewsSection
        initialReviews={reviews}
        initialError={error}
        listTitle="All reviews"
        listDescription="Newest reviews appear first and update live across connected clients."
        emptyMessage="No reviews yet. Be the first to leave one."
      />
    </main>
  );
}

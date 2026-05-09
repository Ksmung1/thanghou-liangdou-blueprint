"use client";

import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import {
  createOptimisticReview,
  mapReviewRow,
  mapReviewRows,
  mergeReview,
  removeReview,
  replaceOptimisticReview,
  sortReviewsNewestFirst,
  type Review,
  type ReviewFormValues,
  validateReviewInput,
} from "../lib/reviews";
import { getSupabaseBrowserClient, type Database } from "../lib/supabase";

type ReviewsSectionProps = {
  initialReviews: Review[];
  initialError: string | null;
  listTitle?: string;
  listDescription?: string;
  emptyMessage?: string;
  limit?: number;
  moreHref?: string;
  moreLabel?: string;
};

export default function ReviewsSection({
  initialReviews,
  initialError,
  listTitle,
  listDescription,
  emptyMessage,
  limit,
  moreHref,
  moreLabel,
}: ReviewsSectionProps) {
  type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

  const [reviews, setReviews] = useState<Review[]>(() =>
    [...initialReviews].sort(sortReviewsNewestFirst),
  );
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(
    initialReviews.length === 0 && !initialError,
  );

  const supabase = getSupabaseBrowserClient();
  const visibleReviews =
    typeof limit === "number" ? reviews.slice(0, limit) : reviews;

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      setLoading(reviews.length === 0);

      const query = supabase
        .from("reviews")
        .select("id, display_name, rating, review_text, created_at")
        .order("created_at", { ascending: false });

      const { data, error: fetchError } =
        typeof limit === "number" ? await query.limit(limit) : await query;

      if (cancelled) {
        return;
      }

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setReviews(mapReviewRows((data as ReviewRow[] | null) ?? []));
      setLoading(false);
    }

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, [limit, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          setReviews((current) =>
            mergeReview(current, mapReviewRow(payload.new as ReviewRow)),
          );
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setError("Realtime connection failed. Refresh to retry.");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function handleSubmit(values: ReviewFormValues): Promise<void> {
    const { data, error: validationError } = validateReviewInput(values);

    if (!data) {
      throw new Error(validationError ?? "Invalid review.");
    }

    setError(null);

    const tempId = `temp:${crypto.randomUUID()}`;
    const optimisticReview = createOptimisticReview(data, tempId);

    setReviews((current) => mergeReview(current, optimisticReview));

    const { data: insertedReview, error: insertError } = await supabase
      .from("reviews")
      .insert({
        display_name: data.displayName,
        rating: data.rating,
        review_text: data.reviewText,
      })
      .select("id, display_name, rating, review_text, created_at")
      .single();

    if (insertError || !insertedReview) {
      setReviews((current) => removeReview(current, tempId));
      throw new Error(insertError?.message ?? "Unable to submit review.");
    }

    setReviews((current) =>
      replaceOptimisticReview(current, tempId, mapReviewRow(insertedReview)),
    );
  }

  return (
    <section className="reviews-shell">
      <div className="reviews-grid">
        <ReviewForm onSubmit={handleSubmit} />
        <ReviewList
          reviews={visibleReviews}
          loading={loading}
          error={error}
          title={listTitle}
          description={listDescription}
          emptyMessage={emptyMessage}
          moreHref={moreHref}
          moreLabel={moreLabel}
        />
      </div>
    </section>
  );
}

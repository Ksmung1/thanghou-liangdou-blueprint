"use client";

import Link from "next/link";
import type { Review } from "../lib/reviews";

type ReviewListProps = {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  emptyMessage?: string;
  moreHref?: string;
  moreLabel?: string;
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function ReviewList({
  reviews,
  loading = false,
  error = null,
  title = "Latest reviews",
  description = "Realtime updates are enabled. New reviews appear instantly across connected browsers.",
  emptyMessage = "No reviews yet. Be the first to leave one.",
  moreHref,
  moreLabel,
}: ReviewListProps) {
  return (
    <section className="card">
      <div className="list-header">
        <div>
          <h2>{title}</h2>
          <p className="card-copy">{description}</p>
        </div>
        <div className="list-side">
          <div className="list-meta">{reviews.length} visible review(s)</div>
          {moreHref && moreLabel ? (
            <Link className="more-link" href={moreHref}>
              {moreLabel}
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <div className="list-state">Loading reviews...</div> : null}
      {!loading && error ? <div className="list-state">{error}</div> : null}
      {!loading && !error && reviews.length === 0 ? (
        <div className="list-state">{emptyMessage}</div>
      ) : null}

      {!loading && reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <article key={review.id} className="review-item">
              <div className="review-header">
                <div>
                  <div className="review-name-row">
                    <span className="review-name">{review.displayName}</span>
                    {review.optimistic ? (
                      <span className="optimistic-badge">Sending</span>
                    ) : null}
                  </div>
                  <div
                    className="review-stars"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {renderStars(review.rating)}
                  </div>
                </div>
                <time className="review-date" dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </div>

              <p className="review-text">{review.reviewText}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

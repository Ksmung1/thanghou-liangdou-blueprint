"use client";

import { useState, useTransition } from "react";
import type { ReviewFormValues } from "../lib/reviews";

type ReviewFormProps = {
  onSubmit: (values: ReviewFormValues) => Promise<void>;
};

const ratingValues = [1, 2, 3, 4, 5];

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const remainingCharacters = 1000 - reviewText.length;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await onSubmit({
          displayName,
          rating,
          reviewText,
        });

        setSuccess("Review submitted.");
        setReviewText("");
        setRating(0);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to submit review.",
        );
      }
    });
  }

  return (
    <section className="card">
      <h2>Leave a review</h2>
      <p className="card-copy">
        Name is optional. If you leave it blank, a random anonymous display
        name is generated automatically.
      </p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            maxLength={40}
            placeholder="Optional custom name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <div className="field-help">
            <span>Examples: Anonymous Tiger, Silent Panda, Cosmic Fox</span>
            <span>{displayName.length}/40</span>
          </div>
        </div>

        <div className="field">
          <label>Rating</label>
          <div className="stars" role="radiogroup" aria-label="Star rating">
            {ratingValues.map((value) => {
              const active = value <= rating;

              return (
                <button
                  key={value}
                  type="button"
                  className={`star-button${active ? " is-active" : ""}`}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label htmlFor="reviewText">Review</label>
          <textarea
            id="reviewText"
            name="reviewText"
            maxLength={1000}
            placeholder="Share your experience"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
          />
          <div className="field-help">
            <span>Maximum 1000 characters</span>
            <span>{remainingCharacters} left</span>
          </div>
        </div>

        <div className="submit-row">
          <button className="submit-button" type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit review"}
          </button>

          {error ? <span className="status-text error">{error}</span> : null}
          {!error && success ? (
            <span className="status-text success">{success}</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}

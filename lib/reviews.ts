import type { Database } from "./supabase";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type Review = {
  id: string;
  displayName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  optimistic?: boolean;
};

export type ReviewFormValues = {
  displayName: string;
  rating: number;
  reviewText: string;
};

export type ValidatedReviewInput = {
  displayName: string;
  rating: number;
  reviewText: string;
};

const adjectives = [
  "Anonymous",
  "Silent",
  "Cosmic",
  "Bright",
  "Calm",
  "Gentle",
  "Hidden",
  "Lucky",
  "Midnight",
  "Swift",
];

const animals = [
  "Tiger",
  "Panda",
  "Fox",
  "Whale",
  "Falcon",
  "Otter",
  "Lynx",
  "Wolf",
  "Koala",
  "Heron",
];

function randomItem(items: readonly string[]): string {
  return items[Math.floor(Math.random() * items.length)] ?? items[0] ?? "Guest";
}

export function generateAnonymousDisplayName(): string {
  return `${randomItem(adjectives)} ${randomItem(animals)}`;
}

export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    displayName: row.display_name,
    rating: row.rating,
    reviewText: row.review_text,
    createdAt: row.created_at,
  };
}

export function mapReviewRows(rows: ReviewRow[]): Review[] {
  return rows.map(mapReviewRow).sort(sortReviewsNewestFirst);
}

export function sortReviewsNewestFirst(a: Review, b: Review): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function validateReviewInput(
  input: ReviewFormValues,
): { data: ValidatedReviewInput | null; error: string | null } {
  const trimmedName = input.displayName.trim();
  const trimmedReview = input.reviewText.trim();

  if (!Number.isInteger(input.rating)) {
    return { data: null, error: "Rating is required." };
  }

  if (input.rating < 1 || input.rating > 5) {
    return { data: null, error: "Rating must be between 1 and 5." };
  }

  if (trimmedName.length > 40) {
    return { data: null, error: "Display name must be 40 characters or less." };
  }

  if (trimmedReview.length === 0) {
    return { data: null, error: "Review text is required." };
  }

  if (trimmedReview.length > 1000) {
    return { data: null, error: "Review text must be 1000 characters or less." };
  }

  return {
    data: {
      displayName: trimmedName || generateAnonymousDisplayName(),
      rating: input.rating,
      reviewText: trimmedReview,
    },
    error: null,
  };
}

export function mergeReview(existing: Review[], incoming: Review): Review[] {
  const withoutIncoming = existing.filter(
    (review) => review.id !== incoming.id && review.id !== `temp:${incoming.id}`,
  );

  return [...withoutIncoming, incoming].sort(sortReviewsNewestFirst);
}

export function replaceOptimisticReview(
  existing: Review[],
  temporaryId: string,
  confirmed: Review,
): Review[] {
  const withoutTemporary = existing.filter((review) => review.id !== temporaryId);
  return mergeReview(withoutTemporary, confirmed);
}

export function removeReview(existing: Review[], reviewId: string): Review[] {
  return existing.filter((review) => review.id !== reviewId);
}

export function createOptimisticReview(
  input: ValidatedReviewInput,
  id: string,
): Review {
  return {
    id,
    displayName: input.displayName,
    rating: input.rating,
    reviewText: input.reviewText,
    createdAt: new Date().toISOString(),
    optimistic: true,
  };
}

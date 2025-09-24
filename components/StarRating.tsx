import React from 'react';

interface StarRatingProps {
  rating: number;
  groupId: string;
}

// Reusable StarRating component that can be used on any page.
// It is a simple presentational component with no client-side logic.
const StarRating = ({ rating, groupId }: StarRatingProps) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="rating rating-xs">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          name={`rating-${groupId}`}
          className="mask mask-star-2 bg-orange-400"
          readOnly
          checked={star <= roundedRating}
          aria-label={`${star} star rating`}
        />
      ))}
    </div>
  );
};

// This must be a default export to be imported as "import StarRating from ..."
export default StarRating;

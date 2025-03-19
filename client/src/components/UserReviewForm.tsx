import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface UserReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
  buttonText?: string;
  isSubmitting?: boolean;
}

export default function UserReviewForm({
  initialRating = 0,
  initialComment = '',
  onSubmit,
  buttonText = 'Submit Review',
  isSubmitting = false,
}: UserReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  // Update state if props change (useful for edit mode)
  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment]);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, comment });
    }
  };

  return (
    <div>
      {/* Star Rating Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-lg focus:outline-none"
              aria-label={`Rate ${star} stars`}>
              {star <= rating ? (
                <Star
                  fill="#ffd063"
                  strokeWidth={1}
                />
              ) : (
                <Star
                  color="#111"
                  strokeWidth={1}
                />
              )}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0
              ? `${rating} stars`
              : "Select a rating"}
          </span>
        </div>
      </div>

      {/* Review Comment Input */}
      <div className="mb-4">
        <label
          htmlFor="reviewComment"
          className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <textarea
          id="reviewComment"
          rows={4}
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-black rounded-md"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className={`p-2 px-4 rounded-full border
          h-11 border-black justify-center items-center ${
            rating > 0 && !isSubmitting
              ? "bg-primary text-black"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

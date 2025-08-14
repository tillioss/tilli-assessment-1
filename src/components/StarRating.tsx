"use client";

import { Star } from "lucide-react";

interface RatingLevels {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

interface StarRatingProps {
  value: string;
  onChange: (value: string) => void;
  maxRating: number;
  ratingLevels: RatingLevels;
  disabled?: boolean;
  showLabel?: boolean;
}

export default function StarRating({
  value,
  onChange,
  maxRating,
  ratingLevels,
  disabled = false,
  showLabel = false,
}: StarRatingProps) {
  const currentRating = value ? parseInt(value) : 0;

  const handleStarClick = (starValue: number) => {
    if (!disabled) {
      onChange(starValue.toString());
    }
  };
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleStarClick(starValue)}
            disabled={disabled}
            className={`transition-colors duration-200 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
            }`}
          >
            <Star
              size={32}
              className={`${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        );
      })}
      {showLabel && value && (
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          {ratingLevels[value as keyof RatingLevels]}
        </span>
      )}
    </div>
  );
}

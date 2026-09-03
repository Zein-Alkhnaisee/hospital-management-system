import React, { useState } from "react";
import "./RatingForm.css";

const RatingForm = ({
  doctorId,
  rating = null,
  onSuccess,
  onCancel,
  onSubmitRating,
}) => {
  const [ratingValue, setRatingValue] = useState(rating?.rating || 5);
  const [review, setReview] = useState(rating?.review_text || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate data
    if (!review.trim()) {
      setError("Please write a review");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ratingData = {
        rating: ratingValue,
        review_text: review,
      };

      const success = await onSubmitRating(ratingData);

      if (success) {
        onSuccess();
      } else {
        setError("Failed to save rating. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Error saving rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-form-container">
      <h3>{rating ? "Edit Your Rating" : "Add Your Rating"}</h3>

      {error && <div className="rating-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= ratingValue ? "filled" : ""}`}
                onClick={() => setRatingValue(star)}
                aria-label={`${star} star`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            placeholder="Share your experience with this doctor"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : "Submit Rating"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;

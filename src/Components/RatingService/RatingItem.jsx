import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import RatingForm from "./RatingForm";
import "./RatingItem.css";

const RatingItem = ({ rating, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        await onDelete(rating.rating_id);
      } catch (error) {
        alert("Error deleting rating: " + error.message);
      }
    }
  };

  return (
    <div className="rating-item">
      {isEditing ? (
        <RatingForm
          doctorId={rating.doctor_id}
          rating={rating}
          onSuccess={() => {
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          onSubmitRating={(ratingData) =>
            onUpdate(rating.rating_id, ratingData)
          }
        />
      ) : (
        <>
          <div className="rating-header">
            <div className="rating-meta">
              <span className="user-name">{rating.user_name}</span>
              <span className="rating-date">
                {new Date(rating.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="rating-stars">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <span
                    key={i}
                    className={`star ${i < rating.rating ? "filled" : ""}`}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
            </div>
          </div>

          <div className="rating-content">
            <p>{rating.review_text}</p>
          </div>

          {user && (
            <div className="rating-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                <i className="bi bi-pencil"></i> Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RatingItem;

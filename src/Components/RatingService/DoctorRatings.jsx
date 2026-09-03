import React, { useState, useEffect } from "react";
import RatingItem from "./RatingItem";
import RatingForm from "./RatingForm";
import ratingService from "./ratingService";
import { useAuth } from "../AuthContext/AuthContext";
import "./DoctorRatings.css";

const DoctorRatings = ({ doctorId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user, isAuthenticated, hasRole } = useAuth();

  const [userRating, setUserRating] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionError(null);

      const response = await ratingService.getDoctorRatings(doctorId);

      if (response && response.data) {
        setRatings(response.data);

        if (user) {
          const userR = response.data.find(
            (r) => r.user_name === user.username
          );
          setUserRating(userR);
        }
      } else {
        setError("فشل تحميل التقييمات: هيكل الاستجابة غير متوقع");
      }
    } catch (err) {
      console.error("Error loading ratings:", err);
      setError(err.message || "حدث خطأ أثناء تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRatings();
    }
  }, [doctorId, isAuthenticated]);

  const handleAddRating = async (ratingData) => {
    try {
      setPermissionError(null);
      // if (!isPatient) {
      //   setPermissionError(
      //     "غير مسموح لك بالتقييم. يجب أن تكون مريضًا لتتمكن من تقييم الأطباء."
      //   );
      //   return false;
      // }
      const response = await ratingService.addRating(doctorId, ratingData);

      if (response && response.data) {
        loadRatings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding rating:", err);

      if (err.message.includes("غير مسموح")) {
        setPermissionError(err.message);
      } else {
        setError(err.message);
      }

      return false;
    }
  };

  const handleUpdateRating = async (ratingId, ratingData) => {
    try {
      await ratingService.updateRating(ratingId, ratingData);
      loadRatings();
      return true;
    } catch (err) {
      console.error("Error updating rating:", err);
      return false;
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await ratingService.deleteRating(ratingId);
      loadRatings();
      return true;
    } catch (err) {
      console.error("Error deleting rating:", err);
      return false;
    }
  };

  if (loading) {
    return <div className="ratings-loading">Loading ratings...</div>;
  }

  if (error) {
    return <div className="ratings-error">{error}</div>;
  }

  return (
    <div className="doctor-ratings">
      <div className="ratings-header">
        <h3>Patient Ratings</h3>

        {isAuthenticated && !userRating && !showForm && (
          <button onClick={() => setShowForm(true)} className="add-rating-btn">
            Add your rating
          </button>
        )}

        {/* {isAuthenticated && ( 
          <div className="permission-error">
          you are not allowed to evaluate , you must be patient so you can assess your doctor
          </div>
        )} */}
      </div>

      {error && <div className="ratings-error">{error}</div>}
      {permissionError && (
        <div className="permission-error">{permissionError}</div>
      )}

      {showForm && (
        <RatingForm
          doctorId={doctorId}
          onSuccess={() => {
            setShowForm(false);
            loadRatings();
          }}
          onCancel={() => setShowForm(false)}
          onSubmitRating={handleAddRating}
        />
      )}

      {userRating && (
        <div className="user-rating-section">
          <h4>Your rating:</h4>
          <RatingItem
            rating={userRating}
            onUpdate={handleUpdateRating}
            onDelete={handleDeleteRating}
          />
        </div>
      )}

      {!loading && ratings.length === 0 && !userRating && (
        <p className="no-ratings">No ratings yet. Be the first to rate!</p>
      )}

      {ratings.length > 0 && (
        <div className="ratings-list">
          {ratings
            .filter((r) => !userRating || r.rating_id !== userRating.rating_id)
            .map((rating) => (
              <RatingItem
                key={rating.rating_id}
                rating={rating}
                onUpdate={handleUpdateRating}
                onDelete={handleDeleteRating}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default DoctorRatings;

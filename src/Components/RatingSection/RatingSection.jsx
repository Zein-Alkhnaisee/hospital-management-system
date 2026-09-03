import { useEffect, useState } from "react";
import "./RatingSection.css";
import Aos from "aos";
import "aos/dist/aos.css";

export function RatingSection() {
  useEffect(() => {
    Aos.init({
      offset: 50,
      easing: "ease-in-out",
      once: false,
    });
    Aos.refresh();
  }, []);
  const [ratings, setRatings] = useState([
    { name: "Ali", stars: 5, comment: "Excellent hospital and great service!" },
    {
      name: "Sara",
      stars: 4,
      comment: "Very good, but waiting time was a bit long.",
    },
  ]);

  const handleAddRating = (newRating) => {
    setRatings((prev) => [...prev, newRating]);
  };

  return (
    <div className="ratings-section-pa">
      <h2 className="ratings-title-pa">Patient Reviews</h2>
      <div className="ratings-list-pa">
        {ratings.map((r, idx) => {
          let anim = "zoom-in-right";
          if (idx % 2 === 0) anim = "zoom-in-right";
          else anim = "zoom-in-left";
          return (
            <div
              className="rating-card-pa"
              key={idx}
              data-aos={anim}
              data-aos-delay={`${idx * 100}`}
            >
              <div className="rating-header-pa">
                <strong>{r.name}</strong>
                <span>
                  {"★".repeat(r.stars)}
                  {"☆".repeat(5 - r.stars)}
                </span>
              </div>
              <p className="rating-comment">"{r.comment}"</p>
            </div>
          );
        })}
      </div>

      <RatingForm onAddRating={handleAddRating} />
    </div>
  );
}

function RatingForm({ onAddRating }) {
  const [name, setName] = useState("");
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    onAddRating({ name, stars, comment });
    setName("");
    setStars(5);
    setComment("");
  };

  return (
    <form className="rating-form-pa" onSubmit={handleSubmit}>
      <h3>Leave your rating</h3>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((s) => (
          <option key={s} value={s}>
            {s} Stars
          </option>
        ))}
      </select>
      <textarea
        placeholder="Your feedback"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

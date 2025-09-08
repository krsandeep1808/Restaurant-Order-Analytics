import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full">★</span>
      ))}
      
      {hasHalfStar && (
        <span className="star half">★</span>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty">★</span>
      ))}
      
      <span className="rating-text">({rating})</span>
    </div>
  );
};

export default StarRating;
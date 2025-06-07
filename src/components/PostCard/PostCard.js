import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const Icon = ({ children }) => <span className="icon">{children}</span>;

const PostCard = ({ post }) => {
  const { id, location, imageUrl, likes, comments, rating, caption, totalImages, currentImage } = post;

  const renderDots = () => {
    if (!totalImages || totalImages <= 1) return null;
    return (
      <div className="carousel-dots">
        {Array.from({ length: totalImages }).map((_, index) => (
          <span key={index} className={`dot ${index === currentImage ? 'active' : ''}`}></span>
        ))}
      </div>
    );
  };

  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <article className="post-card">
      {}
      {location && (
        <h3 className="post-location">{location}</h3>
      )}

      {}
      <Link to={`/attraction/${id}`} className="post-card-link-image">
        <img src={imageUrl} alt={location || 'Post image'} className="post-image" />
      </Link>
      
      {renderDots()}
      
      <div className="post-actions">
        <div className="action-buttons">
          <button className="action-button"><Icon>❤️</Icon> {likes}</button>
          <button className="action-button"><Icon>💬</Icon> {comments}</button>
          <button className="action-button"><Icon>➢</Icon></button>
        </div>
        <div className="post-rating">
          {numericRating.toFixed(1)} {'⭐'.repeat(Math.round(numericRating))}
        </div>
      </div>
      
      <div className="post-caption">
        <p>
          {caption}{' '}
          {}
          <Link to={`/attraction/${id}`} className="ver-mais-link">
            ver mais
          </Link>
        </p>
      </div>
    </article>
  );
};

export default PostCard;

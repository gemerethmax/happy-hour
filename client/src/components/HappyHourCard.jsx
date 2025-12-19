import { useState } from 'react';
import './HappyHourCard.css';

const HappyHourCard = ({ happyHour, onSwipeLeft, onSwipeRight }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatTime = (time) => {
    // Convert 24-hour time to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container">
      <div className={`happy-hour-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        {/* Front of card */}
        <div className="card-face card-front">
          <div className="card-image">
            <img
              src={happyHour.imageUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600'}
              alt={happyHour.title}
            />
          </div>
          <div className="card-content">
            <h2 className="card-title">{happyHour.title}</h2>
            <p className="card-restaurant">{happyHour.restaurant.name}</p>
            <p className="card-tagline">{happyHour.tagline}</p>
            <div className="card-info">
              <span className="card-day">
                {happyHour.specificDate
                  ? new Date(happyHour.specificDate).toLocaleDateString()
                  : happyHour.dayOfWeek !== null
                  ? `Every ${getDayName(happyHour.dayOfWeek)}`
                  : 'Daily'}
              </span>
              <span className="card-time">
                {formatTime(happyHour.startTime)} - {formatTime(happyHour.endTime)}
              </span>
            </div>
            <div className="card-tags">
              {happyHour.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <p className="flip-hint">Click to see details →</p>
          </div>
        </div>

        {/* Back of card */}
        <div className="card-face card-back">
          <div className="card-content">
            <h2 className="card-title">{happyHour.title}</h2>
            <p className="card-restaurant">{happyHour.restaurant.name}</p>
            <div className="card-description">
              <h3>Details</h3>
              <p>{happyHour.description}</p>
            </div>
            {happyHour.restaurant.address && (
              <div className="card-address">
                <h4>Location</h4>
                <p>{happyHour.restaurant.address}</p>
              </div>
            )}
            <p className="flip-hint">← Click to go back</p>
          </div>
        </div>
      </div>

      {/* Swipe action buttons */}
      <div className="card-actions">
        <button onClick={onSwipeLeft} className="btn-skip">
          Skip
        </button>
        <button onClick={onSwipeRight} className="btn-interested">
          Interested!
        </button>
      </div>
    </div>
  );
};

export default HappyHourCard;

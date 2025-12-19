import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { happyHoursAPI, interestsAPI } from '../utils/api';
import HappyHourCard from '../components/HappyHourCard';
import FilterBar from '../components/FilterBar';

const SwipeView = () => {
  const { user, logout } = useAuth();
  const [happyHours, setHappyHours] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ tag: null, day: undefined });

  // Fetch happy hours when component mounts or filters change
  const fetchHappyHours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await happyHoursAPI.getAll(filters);
      setHappyHours(data.data);
      setCurrentIndex(0); // Reset to first card when filters change
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHappyHours();
  }, [fetchHappyHours]);

  const handleSwipeLeft = () => {
    // Skip this happy hour, move to next
    if (currentIndex < happyHours.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = async () => {
    // Save to interests
    const currentHappyHour = happyHours[currentIndex];

    try {
      await interestsAPI.save(currentHappyHour.id);
      // Move to next card
      if (currentIndex < happyHours.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      // If already saved, just move to next
      if (err.message.includes('already saved')) {
        if (currentIndex < happyHours.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        alert('Error saving happy hour: ' + err.message);
      }
    }
  };

  const currentHappyHour = happyHours[currentIndex];
  const isLastCard = currentIndex === happyHours.length - 1;

  return (
    <div className="main-container">
      <header className="app-header">
        <h1>Happy Hour Swipe</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <nav className="main-nav">
        <Link to="/swipe" className="nav-link active">
          Swipe
        </Link>
        <Link to="/interested" className="nav-link">
          Interested
        </Link>
      </nav>

      <main>
        <FilterBar activeFilters={filters} onFilterChange={setFilters} />

        {loading && <p>Loading happy hours...</p>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && happyHours.length === 0 && (
          <div className="no-results">
            <h2>No happy hours found</h2>
            <p>Try changing your filters</p>
          </div>
        )}

        {!loading && !error && currentHappyHour && (
          <>
            <HappyHourCard
              happyHour={currentHappyHour}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
            <div className="card-counter">
              {currentIndex + 1} of {happyHours.length}
              {isLastCard && <span> - Last one!</span>}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SwipeView;

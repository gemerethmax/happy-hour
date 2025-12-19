import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interestsAPI } from '../utils/api';
import '../styles/InterestedView.css';

const InterestedView = () => {
  const { user, logout } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's interested happy hours
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await interestsAPI.getAll();

        // Convert day number to day name (0=Sunday, 6=Saturday)
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Map the nested backend data to a flat structure for easier rendering
        const mappedData = data.data.map((item) => {
          const dayNumber = item.happyHour.dayOfWeek;
          const dayName = dayNames[dayNumber];

          return {
            id: item.interestId,
            happyHourId: item.happyHour.id,
            title: item.happyHour.title,
            tagline: item.happyHour.tagline,
            description: item.happyHour.description,
            dayOfWeek: dayName, // Convert integer to day name
            timeRange: `${item.happyHour.startTime} - ${item.happyHour.endTime}`,
            tags: item.happyHour.tags,
            restaurantName: item.happyHour.restaurant.name,
            restaurantAddress: item.happyHour.restaurant.address,
            savedAt: item.savedAt,
          };
        });
        setInterests(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // Remove a happy hour from interests
  const handleRemove = async (interestId) => {
    try {
      await interestsAPI.delete(interestId);
      // Remove from local state
      setInterests(interests.filter((interest) => interest.id !== interestId));
    } catch (err) {
      alert('Error removing happy hour: ' + err.message);
    }
  };

  // Group interests by day of week
  const groupByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};

    interests.forEach((interest) => {
      const day = interest.dayOfWeek;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(interest);
    });

    // Return days in order, only including days that have interests
    return days
      .filter((day) => grouped[day])
      .map((day) => ({
        day,
        items: grouped[day],
      }));
  };

  const groupedInterests = groupByDay();

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
        <Link to="/swipe" className="nav-link">
          Swipe
        </Link>
        <Link to="/interested" className="nav-link active">
          Interested
        </Link>
      </nav>

      <main>
        <h2>Your Interested Happy Hours</h2>

        {loading && <p>Loading your interests...</p>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && interests.length === 0 && (
          <div className="no-results">
            <p>You haven't saved any happy hours yet.</p>
            <Link to="/swipe" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
              Start Swiping
            </Link>
          </div>
        )}

        {!loading && !error && groupedInterests.length > 0 && (
          <div className="interests-list">
            {groupedInterests.map((group) => (
              <div key={group.day} className="day-group">
                <h3 className="day-header">{group.day}</h3>
                <div className="interest-cards">
                  {group.items.map((interest) => (
                    <div key={interest.id} className="interest-card">
                      <div className="interest-content">
                        <h4 className="interest-title">{interest.title}</h4>
                        <p className="interest-restaurant">{interest.restaurantName}</p>
                        <p className="interest-time">{interest.timeRange}</p>
                        {interest.tagline && (
                          <p className="interest-tagline">{interest.tagline}</p>
                        )}
                        <div className="interest-tags">
                          {interest.tags && interest.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(interest.id)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterestedView;

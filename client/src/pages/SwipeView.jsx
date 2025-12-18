import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SwipeView = () => {
  const { user, logout } = useAuth();

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
        <h2>Swipe View - Coming Soon!</h2>
        <p>We'll build the happy hour cards here next.</p>
      </main>
    </div>
  );
};

export default SwipeView;

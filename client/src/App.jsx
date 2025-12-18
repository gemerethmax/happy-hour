import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SwipeView from './pages/SwipeView';
import InterestedView from './pages/InterestedView';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/swipe"
              element={
                <ProtectedRoute>
                  <SwipeView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interested"
              element={
                <ProtectedRoute>
                  <InterestedView />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/swipe" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

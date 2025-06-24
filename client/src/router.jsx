// client/src/router.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import NewWorkout from './pages/workoutform';
import WorkoutHistory from './pages/workouthistory';
import Profile from './pages/profile';

import Navbar from './components/Navbar'; 

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected  routes*/}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/workout/new" element={<ProtectedRoute><NewWorkout /></ProtectedRoute>} />
        <Route path="/workout/history" element={<ProtectedRoute><WorkoutHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

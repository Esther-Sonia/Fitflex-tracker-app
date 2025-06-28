import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch("https://fitflex-tracker-app-backend.onrender.com/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        setError(data.detail || 'Login failed');
      }

    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 px-4 py-10 flex flex-col items-center justify-center">
      
      <div className="max-w-2xl text-center text-white mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-teal-300">FitFlex</span>
        </h1>
        <p className="text-white/80 text-base">
          FitFlex is your personalized fitness companion helping you stay on track, log your workouts, and become the strongest version of yourself.
        </p>
      </div>

      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl text-white animate-fade-in">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">Login to Your Account</h2>
          <p className="text-sm text-white/80">Start your transformation today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowReset(!showReset)}
            className="text-teal-300 text-sm underline"
          >
            {showReset ? 'Hide Reset Form' : 'Forgot Password?'}
          </button>

          {showReset && (
            <div className="mt-4">
              <ResetPassword />
            </div>
          )}
        </div>

        <p className="text-sm text-center mt-6 text-white/70">
          Don’t have an account?{' '}
          <span
            className="text-teal-300 underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

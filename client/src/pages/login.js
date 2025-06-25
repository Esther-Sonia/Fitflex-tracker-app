import { useState } from 'react';
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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch("https://fitflex-backend.onrender.com/login", {
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
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          Login
        </button>
      </form>

      {/* Reset password toggle buttton here */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowReset(!showReset)}
          className="text-teal-600 text-sm underline"
        >
          {showReset ? 'Hide Reset Form' : 'Forgot Password?'}
        </button>

        {showReset && <ResetPassword />}
      </div>
    </div>
  );
}

export default Login;

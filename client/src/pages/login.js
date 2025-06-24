import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

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
const response = await fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        //  Store token and navigate also store email ansd username
        localStorage.setItem('token', data.access_token);
localStorage.setItem("username", data.username); 
        navigate('/dashboard');
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      
    </div>
  );
}

export default Login;
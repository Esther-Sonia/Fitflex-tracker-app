import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    gender: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleNext(e) {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const payload = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
    };

    try {
      const response = await fetch("https://fitflex-tracker-app-backend.onrender.com/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.detail || 'Registration failed.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl text-white animate-fade-in">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">
            {step === 1 ? 'Register - Step 1' : 'Register - Step 2'}
          </h2>
          <p className="text-sm text-white/80">
            {step === 1 ? 'Create your account' : 'Tell us more about you'}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  required
  className="w-full p-2 border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
>
  <option value="" className="bg-slate-800 text-white">Select Gender</option>
  <option value="female" className="bg-slate-800 text-white">Female</option>
  <option value="male" className="bg-slate-800 text-white">Male</option>
  <option value="other" className="bg-slate-800 text-white">Other</option>
</select>


            </>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : step === 1 ? 'Next' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-white/70">
          Already have an account?{' '}
          <span
            className="text-teal-300 underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;

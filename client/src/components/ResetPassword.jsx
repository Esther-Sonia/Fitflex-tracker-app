import { useState } from 'react';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleReset(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('https://fitflex-tracker-app-backend.onrender.com/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset instructions sent to your email.');
      } else {
        setError(data.detail || 'Failed to send reset instructions.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  }

  return (
    <form onSubmit={handleReset} className="mt-4 space-y-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
      >
        Send Reset Link
      </button>

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

export default ResetPassword;

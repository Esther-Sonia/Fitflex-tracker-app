import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Welcome {username || 'Back'}! 🏋🏽‍♀
      </h1>

      <p className="text-center text-gray-700 mb-6">
        You’re logged in. Ready to track your fitness journey 
      </p>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigate('/workout/new')}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Start New Workout
        </button>

        <button
          onClick={() => navigate('/workout/history')}
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          View Workout History
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          My Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
import { useNavigate } from 'react-router-dom';

function Landingpage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to FitFlex 💪🏽</h1>
        <p className="text-gray-700 mb-6">
          Track your fitness, grow in discipline, and build consistency.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landingpage;

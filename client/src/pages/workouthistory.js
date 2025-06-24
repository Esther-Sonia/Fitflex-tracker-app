import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get('http://localhost:8000/workouts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWorkouts(response.data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const getWorkoutEmoji = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('run')) return '🏃‍♀️';
    if (nameLower.includes('yoga')) return '🧘‍♀️';
    if (nameLower.includes('lift') || nameLower.includes('gym')) return '🏋️‍♂️';
    if (nameLower.includes('dance')) return '💃';
    return '💪';
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Workout History 📅</h2>

      {workouts.length === 0 ? (
        <p className="text-center text-gray-600">No workouts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
  <li key={workout.id} className="border p-4 rounded shadow-sm bg-gray-50">
    <h3 className="text-xl font-semibold">
      {getWorkoutEmoji(workout.name)} {workout.name}
    </h3>
    <p className="text-gray-700">🗓️ <strong>Date:</strong> {workout.date}</p>
    <p className="text-gray-700">📍 <strong>ID:</strong> {workout.id}</p>
    <p className="text-gray-700">🧍 <strong>User ID:</strong> {workout.user_id}</p>

    {/* show exercises here */}
    <div className="mt-2">
      <h4 className="font-semibold">📝 Exercises:</h4>
      <ul className="list-disc list-inside text-gray-600 ml-4">
        {workout.exercises.map((ex, idx) => (
          <li key={idx}>
            {ex.name} — {ex.duration} min
          </li>
        ))}
      </ul>
    </div>

    {/* Show total duration */}
    <p className="text-gray-700 mt-2">
      ⏱️ <strong>Total Duration:</strong> {workout.total_duration} mins
    </p>

    <button
      onClick={() => navigate(`/workout/${workout.id}/edit`)}
      className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
    >
       Edit Workout
    </button>
  </li>
))}

        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;

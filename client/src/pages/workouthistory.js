import { useEffect, useState } from 'react';
import axios from 'axios';

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:8000/workouts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkouts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    }
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    const formattedDate = new Date(editData.date).toISOString().split("T")[0];

    const formattedPayload = {
      name: editData.name,
      date: formattedDate,
      exercises: editData.exercises.map((ex) => ({
        exercise_id: ex.exercise_id,
        duration: Number(ex.duration),
      })),
    };

    try {
      await axios.put(`http://localhost:8000/workouts/${id}`, formattedPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMessage(" Workout updated!");
      setTimeout(() => setMessage(""), 3000);
      setCurrentlyEditingId(null);
      fetchWorkouts();
    } catch (err) {
      console.error('Update error:', err.response?.data || err);
      setMessage(" Failed to update workout.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await axios.delete(`http://localhost:8000/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      setMessage("Workout deleted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Delete error:', JSON.stringify(err.response?.data?.detail, null, 2));
      setMessage(" Failed to delete workout.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getWorkoutEmoji = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('run')) return '🏃‍♀️';
    if (nameLower.includes('yoga')) return '🧘‍♀️';
    if (nameLower.includes('lift') || nameLower.includes('gym')) return '🏋️‍♂️';
    if (nameLower.includes('dance')) return '💃';
    return '💪';
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
    <div className="max-w-6xl mx-auto relative pb-20">
      <h2 className="text-4xl font-bold mb-8 text-center text-teal-700">
        Workout History 📅
      </h2>


      {Array.isArray(workouts) && workouts.length === 0 ? (
        <p className="text-center text-gray-500">You have no workouts yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <li
              key={workout.id}
              className={`rounded-xl shadow-md p-5 list-none transition-transform ${
                currentlyEditingId === workout.id ? 'bg-yellow-50 border border-yellow-300' : 'bg-white'
              }`}
            >
              {currentlyEditingId === workout.id ? (
                <>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full mb-3 p-2 rounded border"
                    placeholder="Workout Name"
                  />
                  <input
                    type="date"
                    value={editData.date || ''}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    className="w-full mb-4 p-2 rounded border"
                  />

                  <div className="mb-3">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Exercises</h4>
                    {editData.exercises?.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2 text-sm">
                        <span className="w-24">{ex.name}</span>
                        <input
                          type="number"
                          min="1"
                          value={ex.duration}
                          onChange={(e) =>
                            setEditData((prev) => {
                              const updated = [...prev.exercises];
                              updated[idx].duration = Number(e.target.value);
                              return { ...prev, exercises: updated };
                            })
                          }
                          className="w-20 border rounded p-1 text-sm"
                        />
                        <span>min</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleUpdate(workout.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setCurrentlyEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-1">
                    {getWorkoutEmoji(workout.name)} {workout.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date:</strong> {workout.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>User ID:</strong> {workout.user_id}
                  </p>

                  <div className="mt-3">
                    <h4 className="font-semibold text-sm mb-1">Exercises</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {workout.exercises.map((ex, idx) => (
                        <li key={idx}>
                          {ex.name} — {ex.duration} min
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Total:</strong> {workout.total_duration} mins
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setCurrentlyEditingId(workout.id);
                        setEditData({
                          name: workout.name,
                          date: workout.date,
                          exercises: workout.exercises.map((ex) => ({
                            name: ex.name,
                            duration: ex.duration,
                            exercise_id: ex.exercise_id,
                          })),
                        });
                      }}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

   {message && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg text-base font-medium max-w-xs text-center z-50">
    {message}
  </div>
)}

    </div>

    </div>
  );
}

export default WorkoutHistory;

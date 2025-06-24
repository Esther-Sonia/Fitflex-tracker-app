import { useEffect, useState } from 'react';

function getExerciseEmoji(name) {
  const lower = name.toLowerCase();
  if (lower.includes("squat")) return "🦵";
  if (lower.includes("push")) return "🤜";
  if (lower.includes("plank")) return "🪵";
  if (lower.includes("jump")) return "⛹️";
  if (lower.includes("press")) return "🏋️";
  if (lower.includes("run")) return "🏃";
  if (lower.includes("crunch")) return "🔥";
  if (lower.includes("pull")) return "🧗";
  if (lower.includes("curl")) return "💪";
  if (lower.includes("dip")) return "↙️";
  if (lower.includes("row")) return "🚣";
  if (lower.includes("twist")) return "🔁";
  if (lower.includes("lunge")) return "🦵";
  if (lower.includes("bike") || lower.includes("cycle")) return "🚴";
  if (lower.includes("rope")) return "🪢";
  return "🏋️";
}

function NewWorkout() {
  const [formData, setFormData] = useState({ name: '', date: '' });
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const workoutPresets = {
    "💥 Full Body Blast": ["Squats", "Push Ups", "Jumping Jacks", "Plank", "Dumbbell Rows"],
    "🦵 Leg Day": ["Lunges", "Leg Press", "Deadlifts", "Calf Raises"],
    "💪 Upper Body Strength": ["Bench Press", "Shoulder Press", "Pull-ups", "Bicep Curls", "Tricep Dips"],
    "🔥 Core Crusher": ["Sit-ups", "Russian Twists", "Leg Raises", "Bicycle Crunches"],
    "⏱️ HIIT Burn": ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees", "Jump Rope"],
    "🏃‍♀️ Cardio Endurance": ["Running (Treadmill)", "Rowing Machine", "Cycling"]
  };

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch('http://localhost:8000/exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    }

    fetchExercises();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "name" && workoutPresets[value]) {
      const presetExerciseNames = workoutPresets[value];
      const selected = exercises
        .filter((ex) => presetExerciseNames.includes(ex.name))
        .map((ex) => ({ exercise_id: ex.id, duration: 15 }));

      setSelectedExercises(selected);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleExerciseToggle(exerciseId) {
    const exists = selectedExercises.find((ex) => ex.exercise_id === exerciseId);
    if (exists) {
      setSelectedExercises(selectedExercises.filter((ex) => ex.exercise_id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, { exercise_id: exerciseId, duration: '' }]);
    }
  }

  function handleDurationChange(exerciseId, value) {
    setSelectedExercises((prev) =>
      prev.map((ex) =>
        ex.exercise_id === exerciseId ? { ...ex, duration: value } : ex
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    function isTokenExpired(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
      } catch (e) {
        return true;
      }
    }

    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
      return;
    }

    const payload = {
      ...formData,
      exercises: selectedExercises
    };

    fetch('http://localhost:8000/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create workout');
        return res.json();
      })
      .then((data) => {
        console.log('Workout saved:', data);
        setSuccessMsg('Workout saved successfully!');
        setFormData({ name: '', date: '' });
        setSelectedExercises([]);
        setTimeout(() => setSuccessMsg(''), 3000);
      })
      .catch((err) => {
        console.error('Error submitting workout:', err);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Create New Workout
          </h1>
        </div>

       

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-white/20">
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800">Workout Type</label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg"
                required
              >
                <option value="">-- Select Your Workout Style --</option>
                {Object.keys(workoutPresets).map((preset) => (
                  <option key={preset} value={preset}>{preset}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800">Workout Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg"
                required
              />
            </div>

            <div className="space-y-6">
              <label className="text-lg font-semibold text-gray-800">Select Exercises</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((ex) => {
                  const selected = selectedExercises.find((e) => e.exercise_id === ex.id);
                  return (
                    <div
                      key={ex.id}
                      className={`relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
                        selected
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => handleExerciseToggle(ex.id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleExerciseToggle(ex.id);
                          }}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getExerciseEmoji(ex.name)}</span>
                          <span className="font-medium text-gray-800">{ex.name}</span>
                        </div>
                      </div>

                      {selected && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="15"
                            value={selected.duration}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleDurationChange(ex.id, Number(e.target.value));
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            required
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        {successMsg && (
          <div className="bg-green-100 text-green-800 px-4 py-3 mb-6 text-center rounded-lg shadow">
            {successMsg}
          </div>
        )}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-500/30"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl"></span>
                  Save Workout Plan
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewWorkout;

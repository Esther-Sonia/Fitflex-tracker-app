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

  // Token expiration check
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
      alert('Workout saved successfully!');
    })
    .catch((err) => {
      console.error('Error submitting workout:', err);
    });
}
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">New Workout</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Select Workout Name --</option>
          {Object.keys(workoutPresets).map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

      <h3 className="text-lg font-semibold mt-4 mb-2">Select Exercises:</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {exercises.map((ex) => {
    const selected = selectedExercises.find((e) => e.exercise_id === ex.id);
    return (
      <div key={ex.id} className="border p-2 rounded bg-gray-50 shadow-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={() => handleExerciseToggle(ex.id)}
          />
          <span>{getExerciseEmoji(ex.name)} {ex.name}</span>
        </label>

        {selected && (
          <input
            type="number"
            min="1"
            placeholder="Duration (mins)"
            value={selected.duration}
            onChange={(e) =>
              handleDurationChange(ex.id, Number(e.target.value))
            }
            className="mt-2 p-1 border rounded w-full"
            required
          />
        )}
      </div>
    );
  })}
</div>


        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Save Workout
        </button>
      </form>
    </div>
  );
}

export default NewWorkout;

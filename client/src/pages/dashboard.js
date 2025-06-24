import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart3,
  CalendarCheck,
  Flame,
  Clock,
  TrendingUp,
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchStats();
    }
  }, [navigate]);

  async function fetchStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:8000/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }


  function formatDuration(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {stats ? (
<div className="grid md:grid-cols-2 gap-6">
            {/* Total Workouts here */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex justify-between items-center mb-3">
                <BarChart3 className="w-6 h-6" />
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              <p className="text-sm text-white/80">Total Workouts</p>
              <h2 className="text-3xl font-bold">{stats.total_workouts}</h2>
            </div>

            {/* Total Exercises here */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex justify-between items-center mb-3">
                <Flame className="w-6 h-6" />
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              <p className="text-sm text-white/80">Total Exercises</p>
              <h2 className="text-3xl font-bold">{stats.total_exercises}</h2>
            </div>

            {/* Latest Workout here */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex justify-between items-center mb-3">
                <CalendarCheck className="w-6 h-6" />
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              <p className="text-sm text-white/80">Latest Workout</p>
              <h3 className="text-lg font-semibold">{stats.latest_workout.name || 'N/A'}</h3>
              <p className="text-white/70 text-sm">{stats.latest_workout.date || 'No recent workout'}</p>
            </div>

            {/* Total Time Spent */}
            <div className="bg-gradient-to-br from-cyan-500 to-sky-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex justify-between items-center mb-3">
                <Clock className="w-6 h-6" />
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              <p className="text-sm text-white/80">Total Time Spent</p>
              <h2 className="text-2xl font-bold">{formatDuration(stats.total_time_spent_minutes)}</h2>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/70">Loading stats...</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

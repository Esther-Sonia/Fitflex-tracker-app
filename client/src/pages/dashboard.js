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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchStats();
      fetchChartData();
    }
  }, [navigate]);

  async function fetchStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("https://fitflex-tracker-app-backend.onrender.com/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function fetchChartData() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("https://fitflex-tracker-app-backend.onrender.com/dashboard/time-by-type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }

  function formatDuration(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
  <div className="max-w-6xl mx-auto flex flex-col gap-10">
    {stats ? (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {/* Total Workouts */}
<div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-10 rounded-3xl shadow-xl text-white">
  <div className="flex justify-between items-center mb-4">
    <BarChart3 className="w-8 h-8" />
    <TrendingUp className="w-5 h-5 text-white/70" />
  </div>
  <p className="text-base text-white/80">Total Workouts</p>
  <h2 className="text-3xl font-bold">{stats.total_workouts}</h2>
</div>

{/* Total Exercises */}
<div className="bg-gradient-to-br from-pink-500 to-rose-600 p-10 rounded-3xl shadow-xl text-white">
  <div className="flex justify-between items-center mb-4">
    <Flame className="w-8 h-8" />
    <TrendingUp className="w-5 h-5 text-white/70" />
  </div>
  <p className="text-base text-white/80">Total Exercises</p>
  <h3 className="text-xl font-semibold">{stats.total_exercises}</h3>
</div>

       {/* Latest Workout */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-3xl shadow-xl text-white">
          <div className="flex justify-between items-center mb-4">
            <CalendarCheck className="w-8 h-8" />
            <TrendingUp className="w-5 h-5 text-white/70" />
          </div>
          <p className="text-base text-white/80">Latest Workout</p>
          <h3 className="text-xl font-semibold">{stats.latest_workout.name || 'N/A'}</h3>
          <p className="text-white/70 text-sm">{stats.latest_workout.date || 'No recent workout'}</p>
        </div>

        {/* Total Time Spent */}
        <div className="bg-gradient-to-br from-cyan-500 to-sky-600 p-10 rounded-3xl shadow-xl text-white">
          <div className="flex justify-between items-center mb-4">
            <Clock className="w-8 h-8" />
            <TrendingUp className="w-5 h-5 text-white/70" />
          </div>
          <p className="text-base text-white/80">Total Time Spent</p>
          <h2 className="text-3xl font-bold">{formatDuration(stats.total_time_spent_minutes)}</h2>
        </div>
      </div>
    ) : (
      <div className="text-center text-white/70">Loading stats...</div>
    )}

    {/* Line Chart */}
    {chartData.length > 0 && (
      <div className="mt-8 bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          Time Spent Per Workout
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="workoutType"
              label={{ value: 'Workout Name', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="timeSpent"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
</div>

  );
}

export default Dashboard;
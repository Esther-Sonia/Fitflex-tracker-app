import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';

function Home() {
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }

    setTimeout(() => setIsVisible(true), 100);
  }, [navigate]);

  const quickActions = [
    {
      title: 'Start Workout',
      desc: 'Jump into your routine',
      emoji: '💪',
      gradient: 'from-red-500 to-teal-600',
      route: '/workout/new',
    },
    {
      title: 'View Progress',
      desc: 'Check your stats',
      emoji: '📊',
      gradient: 'from-blue-500 to-teal-600',
      route: '/dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
      <div
        className={`relative z-10 min-h-screen py-8 px-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-teal-500 to-pink-600 rounded-full mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl animate-bounce">🏋🏽‍♀️</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-pink-200 bg-clip-text text-transparent">
              Welcome {username}!
            </h1>

            <p className="text-white/80 text-2xl font-light mb-6 max-w-2xl mx-auto">
              Ready to crush your fitness goals and become the best version of yourself?
            </p>

            <div className="flex items-center justify-center gap-3 text-teal-300">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-medium bg-gradient-to-r from-teal-300 to-teal-300 bg-clip-text text-transparent">
                Let's make today legendary!
              </span>
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={action.title}
                onClick={() => navigate(action.route)}
                className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-12 transition-transform duration-300`}
                >
                  <span className="text-3xl">{action.emoji}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-200 transition-colors">
                  {action.title}
                </h3>

                <p className="text-white/70 mb-4 group-hover:text-white/90 transition-colors">
                  {action.desc}
                </p>

                <div className="flex items-center text-teal-300 group-hover:text-teal-200 transition-colors">
                  <span className="text-sm font-medium mr-2">Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

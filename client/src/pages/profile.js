import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, Weight, Shield } from 'lucide-react';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View your account information</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 via-teal-600 to-teal-600 p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{userData.username}</h2>
                <p className="text-indigo-100 text-lg">{userData.email}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard icon={<User className="text-indigo-600" />} label="Username" value={userData.username} bg="bg-indigo-100" />
              <InfoCard icon={<Mail className="text-green-600" />} label="Email" value={userData.email} bg="bg-green-100" />
              <InfoCard icon={<Calendar className="text-blue-600" />} label="Age" value={`${userData.age} years`} bg="bg-blue-100" />
              <InfoCard icon={<Weight className="text-purple-600" />} label="Weight" value={userData.weight} bg="bg-purple-100" />
              <InfoCard icon={<Shield className="text-pink-600" />} label="Gender" value={userData.gender} bg="bg-pink-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, bg }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;

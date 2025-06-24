import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, Weight, Edit, Shield, Camera } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
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
        {/* Header section */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Card  section*/}
          <div>
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Profile Header section*/}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 relative">
                <div className="absolute top-4 right-4">
                  <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* profile Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Basic user Info */}
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

              {/* Profile Details */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username section */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email section */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Age  section*/}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Age</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.age} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Weight section */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Weight className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Weight</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.weight}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gender section */}
<div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
  <div className="flex items-center space-x-4">
    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
      <Shield className="w-6 h-6 text-pink-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</p>
      <p className="text-lg font-semibold text-gray-900 capitalize">{userData.gender}</p>
    </div>
  </div>
</div>


                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
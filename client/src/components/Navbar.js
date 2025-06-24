import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setToken(storedToken);
    setUser(userData ? JSON.parse(userData) : null);
  }, [location]);

  function handleLogout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate('/login');
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function isActiveRoute(path) {
    return location.pathname === path;
  }

 const navLinks = [
  { path: '/home', label: 'Home', title: 'Welcome Page' },
  { path: '/dashboard', label: 'Dashboard', title: 'View your summary' },
  { path: '/workout/new', label: 'New Workout', title: 'Create a new workout' },
  { path: '/workout/history', label: 'History', title: 'Workout history' },
  { path: '/profile', label: 'Profile', title: 'Your profile' },
];


  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-lg border-b border-teal-600">
<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          
         <Link
  to="/"
  className="flex items-center space-x-2 text-xl font-bold hover:text-blue-200 transition-colors duration-200"
>
  <span className="text-2xl animate-pulse">💪🏽</span>
  <span>FitFlex</span>
</Link>


          {token && (
            <>
              {/* Desktop Navigation here */}
              <div className="hidden md:flex items-center space-x-6">
                {navLinks.map(({ path, label, icon, title }) => (
                  <Link
                    key={path}
                    to={path}
                    title={title}
                    className={`group flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActiveRoute(path)
                        ? 'bg-teal-600 text-white underline decoration-white'
                        : 'hover:bg-teal-600 hover:text-white'
                    }`}
                  >
                    <span className="transition-transform group-hover:scale-110">{icon}</span>
                    <span>{label}</span>
                  </Link>
                ))}

                {/* User Section with Avatar here*/}
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-teal-600">
                  {user && (
                    <>
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.name || user.email || 'User'}&background=0D8ABC&color=fff`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-white"
                      />
                      <span className="text-sm text-blue-200">
                        Welcome, {user.name || user.email || 'User'}!
                      </span>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg--500 hover:bg-black-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md hover:bg-teal-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* unauthenticated users */}
          {!token && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute('/login')
                    ? 'bg-teal-600 text-white'
                    : 'hover:bg-teal-600 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-md text-sm font-medium border border-white transition-all duration-200 ${
                  isActiveRoute('/register')
                    ? 'bg-white text-teal-700'
                    : 'hover:bg-white hover:text-teal-700'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation code here */}
        {token && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-teal-600">
              {navLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActiveRoute(path)
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-teal-600 hover:text-white'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}

              {/* Mobile user logout section*/}
              <div className="pt-4 border-t border-blue-600 mt-4">
                {user && (
                  <div className="flex items-center space-x-3 px-3 py-2 text-sm text-blue-200">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name || user.email || 'User'}&background=0D8ABC&color=fff`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-white"
                    />
                    <span>
                      Welcome, {user.name || user.email || 'User'}!
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-black-500 hover:bg-black-600 transition-colors duration-200"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

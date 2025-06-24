import React, { useEffect } from 'react';
import AppRouter from './router';

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppRouter />
    </div>
  );
}

export default App;

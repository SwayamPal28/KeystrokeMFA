import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSessionStore } from '../store/sessionStore';
import { LogOut, Shield } from 'lucide-react';
import { FileManager } from './FileManager';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuthStore();
  const { clearSession, updateActivity } = useSessionStore();

  useEffect(() => {
    const handleActivity = () => updateActivity();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold">Secure Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {currentUser?.username || 'Guest'}!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully logged in using keystroke dynamics authentication.
              This is a secure area of the application.
            </p>
            <FileManager />
          </div>
        </div>
      </main>
    </div>
  );
}

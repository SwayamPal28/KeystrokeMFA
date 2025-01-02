import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { UserSquare2, LogIn } from 'lucide-react';
import { supabase } from './utils/supabase';

export default function App() {
  const testSupabase = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Supabase data:', data);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-8">
                  Keystroke Dynamics Authentication
                </h1>
                <div className="flex gap-4">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <UserSquare2 className="w-5 h-5" />
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                </div>
                {/* Add a test button for development purposes */}
                <div className="mt-4">
                  <button
                    onClick={testSupabase}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Test Supabase
                  </button>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

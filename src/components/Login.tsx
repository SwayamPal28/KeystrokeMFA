import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcryptjs';
import { calculateKeystrokeMetrics, comparePatterns } from '../utils/keystrokeAnalysis';
import { KeystrokeInput } from './KeystrokeInput';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const { setCurrentUser } = useAuthStore();

  const fetchUser = async (username: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn('No user found with the provided username.');
      return null;
    }

    console.log('Fetched user:', data[0]);
    return data[0];
  };

  const handleKeystrokeComplete = async (keystrokes: any) => {
    setLoading(true);

    try {
      console.log('Logging in with username:', username);
      const user = await fetchUser(username);

      if (!user) {
        setError('User not found.');
        setLoading(false);
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isPasswordValid);

      if (!isPasswordValid) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      const currentPattern = calculateKeystrokeMetrics(keystrokes);
      const isAuthentic = comparePatterns(user.keystroke_patterns, currentPattern);

      if (isAuthentic) {
        console.log('User authenticated successfully.');
        setError('');
        setCurrentUser(user); // Set the current user
        navigate('/dashboard');
      } else {
        setError('Keystroke authentication failed. Verify via OTP.');
        setShowOTP(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp === '123456') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {!showOTP ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <KeystrokeInput value={username} onChange={setUsername} onComplete={() => {}} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <KeystrokeInput
                type="password"
                value={password}
                onChange={setPassword}
                onComplete={handleKeystrokeComplete}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <p className="text-sm text-gray-600">Press Enter after typing your password</p>
          </div>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

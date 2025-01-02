import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeystrokeInput } from './KeystrokeInput';
import { supabase } from '../utils/supabase'; // Import Supabase client
import { calculateKeystrokeMetrics } from '../utils/keystrokeAnalysis';
import { KeystrokeData } from '../types/auth';
import { UserSquare2, AlertCircle } from 'lucide-react';
import bcrypt from 'bcryptjs';

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempt, setAttempt] = useState(1);
  const [keystrokePatterns, setKeystrokePatterns] = useState([]);
  const [firstPassword, setFirstPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetAttempts = () => {
    setAttempt(1);
    setKeystrokePatterns([]);
    setFirstPassword('');
    setPassword('');
    setError('');
  };

  const handleKeystrokeComplete = async (keystrokes: KeystrokeData[]) => {
    if (attempt === 1) {
      setFirstPassword(password);
      setPassword('');
      setAttempt(2);
      setKeystrokePatterns([calculateKeystrokeMetrics(keystrokes)]);
      return;
    }
  
    if (password !== firstPassword) {
      setError('Password does not match the first attempt. Please start over.');
      setTimeout(resetAttempts, 2000);
      return;
    }
  
    const pattern = calculateKeystrokeMetrics(keystrokes);
    setKeystrokePatterns([...keystrokePatterns, pattern]);
  
    if (attempt < 5) {
      setPassword('');
      setAttempt(attempt + 1);
      setError('');
    } else {
      setLoading(true); // Show loading state
  
      try {
        // Hash the password before inserting into Supabase
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert user into Supabase
        const { error } = await supabase.from('users').insert({
          username,
          password: hashedPassword,
          keystroke_patterns: [...keystrokePatterns, pattern], // Save the patterns
        });
  
        if (error) {
          console.error('Error registering user:', error); // Log the error
          setError('Registration failed. Please try again.');
        } else {
          console.log('User registered successfully.'); // Log success
          alert('Registration successful! Please log in.');
          navigate('/login'); // Redirect to the login page
        }
      } catch (err) {
        console.error('Unexpected error during registration:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <UserSquare2 className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <p className="text-gray-600 mb-6 text-center">
          Attempt {attempt} of 5 - Please type your credentials naturally
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <KeystrokeInput
              value={username}
              onChange={setUsername}
              onComplete={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {attempt === 1 ? 'Create Password' : 'Repeat Password'}
            </label>
            <KeystrokeInput
              type="password"
              value={password}
              onChange={setPassword}
              onComplete={handleKeystrokeComplete}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Press Enter after typing your password
          </p>
          {attempt > 1 && (
            <p className="text-sm text-gray-600">
              Make sure to type the same password as your first attempt
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <p className="text-white">Registering...</p>
        </div>
      )}
    </div>
  );
}

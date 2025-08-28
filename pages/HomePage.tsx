
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import Loader from '../components/icons/Loader';

const HomePage: React.FC = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreating(true);
    setError('');
    
    let newCode = '';
    let inserted = false;
    let attempts = 0;

    while (!inserted && attempts < 5) {
      newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data, error: insertError } = await supabase
        .from('sessions')
        .insert({ session_code: newCode, current_question_index: 0 })
        .select()
        .single();
      
      if (data) {
        inserted = true;
        navigate(`/host/${newCode}`);
      } else {
        console.error('Session creation attempt failed:', insertError?.message);
        attempts++;
      }
    }

    if (!inserted) {
      setError('Could not create a session. Please try again.');
    }
    setIsCreating(false);
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsJoining(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select('id')
      .eq('session_code', sessionCode.toUpperCase())
      .single();

    if (fetchError || !data) {
      setError('Invalid session code. Please check and try again.');
    } else {
      navigate(`/participant/${sessionCode.toUpperCase()}`);
    }
    setIsJoining(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white">
          Welcome to <span className="text-indigo-400">Interactive Classroom</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Engage your students with live presentations and real-time quizzes.
        </p>
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
        {authLoading ? (
            <div className="flex justify-center items-center h-48"><Loader /></div>
        ) : user ? (
          <>
            <div>
              <button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isCreating ? <Loader /> : 'Create New Presentation'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or Join a Session</span>
              </div>
            </div>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder="Enter Session Code"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={isJoining || sessionCode.length < 6}
                className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isJoining ? <Loader /> : 'Join Presentation'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 mb-4">Please sign in or create an account to continue.</p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Login / Sign Up
            </button>
          </div>
        )}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default HomePage;

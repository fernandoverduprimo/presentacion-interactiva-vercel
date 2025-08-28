
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PRESENTATION_SLIDES } from '../lib/presentation';
import Slide from '../components/Slide';
import Question from '../components/Question';
import Loader from '../components/icons/Loader';
import type { Database } from '../types';

type Session = Database['public']['Tables']['sessions']['Row'];
type Answer = Database['public']['Tables']['answers']['Row'];

const ParticipantPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());

  const currentSlideIndex = session?.current_question_index ?? 0;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const fetchSessionData = useCallback(async () => {
    if (!sessionCode) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .single();

    if (error || !data) {
      console.error('Error fetching session:', error);
      navigate('/not-found');
    } else {
      setSession(data);
    }
    setLoading(false);
  }, [sessionCode, navigate]);

  const fetchUserAnswers = useCallback(async (sessionId: string, userId: string) => {
    const { data, error } = await supabase
      .from('answers')
      .select('question_index, selected_option')
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user answers:', error);
    } else if (data) {
      const answersMap = new Map(data.map(a => [a.question_index, a.selected_option]));
      setUserAnswers(answersMap);
    }
  }, []);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  useEffect(() => {
    if (session && user) {
      fetchUserAnswers(session.id, user.id);
    }
  }, [session, user, fetchUserAnswers]);
  
  useEffect(() => {
    setSubmittedAnswer(userAnswers.get(currentSlideIndex) || null);
  }, [currentSlideIndex, userAnswers]);

  useEffect(() => {
    if (!sessionCode) return;
    const channel = supabase
      .channel(`session:${sessionCode}`)
      .on<Session>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `session_code=eq.${sessionCode}`,
        },
        (payload) => {
          setSession(payload.new as Session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionCode]);

  const handleAnswerSubmit = async (optionId: string) => {
    if (!session || !user || !currentSlide || !currentSlide.correctOptionId) return;

    setSubmittedAnswer(optionId);
    setUserAnswers(prev => new Map(prev).set(currentSlideIndex, optionId));

    const isCorrect = optionId === currentSlide.correctOptionId;
    
    await supabase.from('answers').insert({
      session_id: session.id,
      user_id: user.id,
      question_index: currentSlideIndex,
      selected_option: optionId,
      is_correct: isCorrect,
    });
  };

  if (loading || !session) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-indigo-400">Student View</h1>
        <div className="text-right">
          <p className="text-white">{profile?.full_name}</p>
          <p className="text-xs text-gray-400">Session: {sessionCode}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 space-y-4 md:space-y-0 md:space-x-8 overflow-hidden">
        <div className="flex-1 bg-black rounded-lg shadow-2xl overflow-hidden h-1/2 md:h-full">
          <Slide slide={currentSlide} />
        </div>
        {currentSlide.type === 'question' && (
          <aside className="w-full md:w-1/3 h-1/2 md:h-full bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col">
            <Question
              slide={currentSlide}
              onAnswerSubmit={handleAnswerSubmit}
              submittedAnswer={submittedAnswer}
            />
          </aside>
        )}
      </main>
    </div>
  );
};

export default ParticipantPage;

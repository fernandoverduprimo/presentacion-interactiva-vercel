import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { PRESENTATION_SLIDES } from '../lib/presentation';
import Slide from '../components/Slide';
import ResultsChart from '../components/ResultsChart';
import ChevronLeft from '../components/icons/ChevronLeft';
import ChevronRight from '../components/icons/ChevronRight';
import Loader from '../components/icons/Loader';
import type { Database } from '../types';

type Session = Database['public']['Tables']['sessions']['Row'];
type Answer = Database['public']['Tables']['answers']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

type AnswerWithProfile = Answer & { profiles: Profile | null };

const HostPage: React.FC = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<AnswerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const currentSlideIndex = session?.current_question_index ?? 0;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const fetchSession = useCallback(async () => {
    if (!sessionCode) return;
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
      setLoading(false);
    }
  }, [sessionCode, navigate]);

  const fetchAnswers = useCallback(async (sessionId: string) => {
    // FIX: The original query `select('*, profiles(full_name)')` was incorrect as there's no direct foreign key from `answers` to `profiles`.
    // The corrected query `select('*, profiles!user_id(*)')` tells Supabase to join `profiles` on `answers.user_id = profiles.id`, fetching all profile fields.
    const { data, error } = await supabase
      .from('answers')
      .select('*, profiles!user_id(*)')
      .eq('session_id', sessionId)
      .eq('question_index', currentSlideIndex);
      
    if (error) {
        console.error('Error fetching answers:', error);
    } else {
        setAnswers(data as AnswerWithProfile[]);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  
  useEffect(() => {
    if (session) {
      fetchAnswers(session.id);
    }
  }, [session, fetchAnswers, currentSlideIndex]);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`answers:${session.id}`)
      .on<Answer>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'answers', filter: `session_id=eq.${session.id}` },
        async (payload) => {
          const newAnswer = payload.new as Answer;
          if (newAnswer.question_index === currentSlideIndex) {
            // FIX: The original query `select('full_name')` did not fetch the `id` field from the profiles table.
            // This caused a type error because the `Profile` type requires both `id` and `full_name`.
            // Changed to `select('*')` to fetch the complete profile object.
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', newAnswer.user_id).single();
            setAnswers(prev => [...prev, {...newAnswer, profiles: profile}]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, currentSlideIndex]);
  
  const updateSlideIndex = async (newIndex: number) => {
    if (!session || newIndex < 0 || newIndex >= PRESENTATION_SLIDES.length) return;
    const { error } = await supabase
      .from('sessions')
      .update({ current_question_index: newIndex })
      .eq('id', session.id);
    if (error) {
      console.error('Error updating slide:', error);
    } else {
      setSession(prev => prev ? { ...prev, current_question_index: newIndex } : null);
      setAnswers([]); // Clear answers for the new slide
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-indigo-400">Professor View</h1>
        <div className="text-center">
          <span className="text-gray-400">Session Code:</span>
          <span className="ml-2 font-mono text-2xl tracking-widest bg-gray-700 text-white py-1 px-3 rounded-md">{sessionCode}</span>
        </div>
        <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">End Session</button>
      </header>

      <main className="flex-1 flex p-4 md:p-8 space-x-8 overflow-hidden">
        <div className="w-2/3 h-full flex flex-col">
          <div className="flex-1 bg-black rounded-lg shadow-2xl overflow-hidden">
            {currentSlide && <Slide slide={currentSlide} />}
          </div>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button onClick={() => updateSlideIndex(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} className="p-3 bg-indigo-600 rounded-full disabled:bg-gray-600 hover:bg-indigo-500 transition"><ChevronLeft /></button>
            <span className="font-medium text-lg">{currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}</span>
            <button onClick={() => updateSlideIndex(currentSlideIndex + 1)} disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1} className="p-3 bg-indigo-600 rounded-full disabled:bg-gray-600 hover:bg-indigo-500 transition"><ChevronRight /></button>
          </div>
        </div>

        <aside className="w-1/3 h-full bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col">
          {currentSlide?.type === 'question' ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-indigo-300">Live Results</h2>
              <div className="flex-1">
                <ResultsChart answers={answers} options={currentSlide.options || []} />
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="text-5xl text-gray-500 mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-400">Content Slide</h2>
              <p className="text-gray-500">Live results will appear here for question slides.</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default HostPage;

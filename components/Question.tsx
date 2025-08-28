
import React from 'react';
import type { SlideContent } from '../types';

interface QuestionProps {
  slide: SlideContent;
  onAnswerSubmit: (optionId: string) => void;
  submittedAnswer: string | null;
}

const Question: React.FC<QuestionProps> = ({ slide, onAnswerSubmit, submittedAnswer }) => {
  if (slide.type !== 'question' || !slide.options) {
    return null;
  }

  const getButtonClass = (optionId: string) => {
    let baseClass = 'w-full text-left font-semibold p-4 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    if (submittedAnswer) {
      if (optionId === submittedAnswer) {
        return `${baseClass} bg-indigo-500 border-indigo-400 text-white ring-2 ring-indigo-300`;
      }
      return `${baseClass} bg-gray-700 border-gray-600 text-gray-400`;
    }
    return `${baseClass} bg-gray-700 border-gray-600 hover:bg-indigo-600 hover:border-indigo-500`;
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-indigo-300">Choose your answer:</h2>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {slide.options.map(option => (
          <button
            key={option.id}
            onClick={() => onAnswerSubmit(option.id)}
            disabled={!!submittedAnswer}
            className={getButtonClass(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>
      {submittedAnswer && (
        <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg text-center">
          <p className="font-semibold text-green-300">Your answer has been submitted. Waiting for the next slide.</p>
        </div>
      )}
    </div>
  );
};

export default Question;

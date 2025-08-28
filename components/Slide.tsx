
import React from 'react';
import type { SlideContent } from '../types';

interface SlideProps {
  slide: SlideContent;
}

const Slide: React.FC<SlideProps> = ({ slide }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 md:p-16 bg-black text-white relative">
      {slide.image && <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
          {slide.title}
        </h1>
        {slide.content && (
          <div className="space-y-4 text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto">
            {slide.content.map((item, index) => <p key={index}>{item}</p>)}
          </div>
        )}
        {slide.type === 'question' && (
          <p className="mt-8 text-2xl md:text-3xl font-semibold text-indigo-300 max-w-4xl mx-auto">
            {slide.question}
          </p>
        )}
      </div>
    </div>
  );
};

export default Slide;

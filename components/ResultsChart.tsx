
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SlideContent } from '../types';

type Answer = {
  selected_option: string;
};

interface ResultsChartProps {
  answers: Answer[];
  options: SlideContent['options'];
}

const COLORS = ['#818cf8', '#60a5fa', '#34d399', '#facc15'];

const ResultsChart: React.FC<ResultsChartProps> = ({ answers, options = [] }) => {
  const data = useMemo(() => {
    const voteCounts = new Map<string, number>();
    options.forEach(option => voteCounts.set(option.id, 0));
    answers.forEach(answer => {
      voteCounts.set(answer.selected_option, (voteCounts.get(answer.selected_option) || 0) + 1);
    });

    return options.map(option => ({
      name: option.text,
      votes: voteCounts.get(option.id) || 0,
    }));
  }, [answers, options]);
  
  const totalVotes = answers.length;

  if (totalVotes === 0) {
    return (
      <div className="flex flex-col h-full justify-center items-center text-center text-gray-400">
        <div className="text-4xl mb-4">⏳</div>
        <p className="font-semibold">Waiting for answers...</p>
        <p className="text-sm text-gray-500">Results will appear here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-center text-gray-300 mb-4">{totalVotes} total answer(s)</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" stroke="#9ca3af" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af" 
            width={100}
            tick={{ fill: '#d1d5db', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
          />
          <Tooltip 
            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', color: '#e5e7eb' }}
          />
          <Bar dataKey="votes" barSize={30} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;

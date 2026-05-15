import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

export function Analytics() {
  const logs = useAppStore(state => state.logs);
  const habits = useAppStore(state => state.habits);

  const chartData = useMemo(() => {
    const data = [];
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const shortStr = format(date, 'EEE'); // Mon, Tue...
      
      const count = logs.filter(l => l.localDate === dateStr).length;
      data.push({
        name: shortStr,
        fullDate: dateStr,
        completions: count,
      });
    }
    return data;
  }, [logs]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-xl font-medium text-[#3a3a2e] mb-1">Insights</h2>
        <span className="text-[10px] font-sans uppercase tracking-widest opacity-50">Last 7 Days</span>
      </header>
      
      <div className="bg-white rounded-[32px] p-6 border border-[#e6e6da] shadow-sm">
        <h3 className="text-lg font-serif text-[#5a5a40] mb-6">Completions</h3>
        <div className="h-64 w-full font-sans text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#5a5a40', opacity: 0.7, fontSize: 10, fontFamily: 'Inter' }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f5f5f0' }}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e6e6da', borderRadius: '16px', fontFamily: 'Inter', color: '#3a3a2e', fontSize: '12px' }}
                itemStyle={{ color: '#8a9a5b', fontWeight: 'bold' }}
              />
              <Bar dataKey="completions" radius={[8, 8, 8, 8]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completions > 0 ? '#8a9a5b' : '#d9c5b2'} opacity={entry.completions > 0 ? 1 : 0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[32px] p-6 border border-[#e6e6da] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-sans uppercase tracking-widest opacity-50 mb-2">Total Habits</div>
          <div className="text-3xl font-light text-[#5a5a40]">{habits.length}</div>
        </div>
        <div className="bg-white rounded-[32px] p-6 border border-[#e6e6da] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-sans uppercase tracking-widest opacity-50 mb-2">Completions</div>
          <div className="text-3xl font-light text-[#8a9a5b]">{logs.length}</div>
        </div>
      </div>
    </div>
  );
}

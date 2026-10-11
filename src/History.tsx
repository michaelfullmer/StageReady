import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ChevronRight, Award, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { VocalSession } from './types';
import { loadState } from './storage';

export default function History() {
  const [sessions, setSessions] = useState<VocalSession[]>([]);

  useEffect(() => {
    const state = loadState();
    setSessions(state.sessions);
  }, []);

  const getTrend = (current: number, index: number) => {
    // Oldest session (last in array) has no previous to compare
    if (index === sessions.length - 1) {
      return <Minus className="w-3 h-3 text-brand-light-grey" />;
    }
    
    // Compare to the session that came BEFORE it in time (which is index + 1 in our newest-first array)
    const prev = sessions[index + 1].scores.overall;
    const diff = current - prev;
    
    if (diff > 0) return (
      <span className="flex items-center text-green-500 text-[10px] font-bold">
        <ArrowUp className="w-3 h-3 mr-0.5" />
        {diff}
      </span>
    );
    if (diff < 0) return (
      <span className="flex items-center text-red-500 text-[10px] font-bold">
        <ArrowDown className="w-3 h-3 mr-0.5" />
        {Math.abs(diff)}
      </span>
    );
    return <Minus className="w-3 h-3 text-brand-light-grey" />;
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto safe-bottom">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-teal">Session History</h1>
        <p className="text-brand-light-grey">Your last 10 vocal analysis sessions</p>
      </header>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-grey/30 border border-brand-grey rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-brand-black border-2 border-brand-teal flex items-center justify-center shrink-0">
                  <span className="text-xl font-black text-brand-teal">{session.scores.overall}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-brand-grey border border-white/10 rounded-full p-1">
                  {getTrend(session.scores.overall, index)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{session.date}</h3>
                  <Award className="w-4 h-4 text-brand-teal" />
                </div>
                <p className="text-xs text-brand-light-grey line-clamp-1 mt-1 italic">
                  "{session.tip}"
                </p>
                
                <div className="flex flex-col gap-2 mt-3">
                  <FullStat label="Pitch" score={session.scores.pitchStability} />
                  <FullStat label="Tone" score={session.scores.toneConsistency} />
                  <FullStat label="Breath" score={session.scores.breathControl} />
                </div>
              </div>
              
              <ChevronRight className="w-5 h-5 text-brand-grey" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-brand-grey/20 rounded-full flex items-center justify-center">
            <HistoryIcon className="w-10 h-10 text-brand-grey" />
          </div>
          <div>
            <h3 className="text-xl font-bold">No Sessions Yet</h3>
            <p className="text-brand-light-grey max-w-[200px] mx-auto mt-2">
              Complete your first vocal coach session to see your progress here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FullStat({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-brand-light-grey w-10">{label}</span>
      <div className="flex-1 h-1.5 bg-brand-black rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand-teal" 
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-brand-light-grey w-6 text-right">{score}%</span>
    </div>
  );
}

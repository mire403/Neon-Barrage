import React from 'react';
import { PatternConfig } from '../types';
import { DIFFICULTY_COLORS } from '../constants';

interface PatternInfoProps {
  pattern: PatternConfig | null;
  stats: { bulletCount: number; fps: number };
}

export const PatternInfo: React.FC<PatternInfoProps> = ({ pattern, stats }) => {
  if (!pattern) {
    return (
        <div className="border border-[#222] p-4 h-[200px] flex flex-col items-center justify-center text-[#444] font-mono bg-black/50">
            <div className="animate-pulse tracking-widest text-sm">NO SIGNAL DETECTED</div>
            <div className="text-xs mt-2 font-sans-cn opacity-50">等待数据流接入...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]">
      {/* Header Block */}
      <div className="border-b-2 border-[#39ff14] pb-3 bg-gradient-to-r from-[#39ff1411] to-transparent pl-2 pt-2">
        <h2 className="text-xl font-sans-cn font-black text-white leading-none mb-1 tracking-wider shadow-black drop-shadow-md">
            {pattern.name}
        </h2>
        <div className="flex justify-between items-end pr-2">
            <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-black border ${DIFFICULTY_COLORS[pattern.difficulty]}`}>
                RANK: {pattern.difficulty}
            </div>
            <div className="font-mono text-[10px] text-[#555]">
                ID: {Math.random().toString(16).substr(2, 6).toUpperCase()}
            </div>
        </div>
      </div>

      {/* Description as a terminal log */}
      <div className="bg-[#080808] p-3 border-l-2 border-[#444] font-sans-cn text-xs text-[#ccc] leading-relaxed relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 opacity-20 text-[#39ff14]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        </div>
        <p className="tracking-wide"><span className="text-[#39ff14] font-mono mr-2">>></span>{pattern.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
         <div className="bg-[#111] p-2 border-r border-[#333]">
            <div className="text-[10px] text-[#555] uppercase font-display mb-1 tracking-wider">OBJECT COUNT</div>
            <div className="text-2xl text-[#00ffff] font-mono leading-none tracking-tighter">{stats.bulletCount}</div>
            <div className="w-full h-1 bg-[#222] mt-1">
                <div className="h-full bg-[#00ffff]" style={{ width: `${Math.min(100, stats.bulletCount / 5)}%` }}></div>
            </div>
         </div>
         <div className="bg-[#111] p-2">
            <div className="text-[10px] text-[#555] uppercase font-display mb-1 tracking-wider">REFRESH RATE</div>
            <div className={`text-2xl font-mono leading-none tracking-tighter ${stats.fps < 45 ? 'text-[#ff0055]' : 'text-[#39ff14]'}`}>
                {stats.fps} <span className="text-[10px] align-top opacity-50">FPS</span>
            </div>
            <div className="w-full h-1 bg-[#222] mt-1">
                 <div className={`h-full ${stats.fps < 45 ? 'bg-[#ff0055]' : 'bg-[#39ff14]'}`} style={{ width: `${(stats.fps / 60) * 100}%` }}></div>
            </div>
         </div>
      </div>

      {/* Emitter Chips */}
      <div>
        <div className="text-[10px] text-[#555] uppercase font-display mb-2 border-b border-[#222] inline-block tracking-widest">
            ACTIVE NODES
        </div>
        <div className="flex flex-wrap gap-1">
            {pattern.emitters.map((e, i) => (
                <div key={i} className="text-[10px] px-2 py-1 bg-[#111] text-[#888] border border-[#222] font-mono hover:border-[#39ff14] hover:text-[#39ff14] transition-colors cursor-default">
                    {e.type.toUpperCase()}_{e.shape.substring(0,3).toUpperCase()}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
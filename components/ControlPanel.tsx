import React, { useState } from 'react';

interface ControlPanelProps {
  onGenerate: (theme: string) => void;
  isGenerating: boolean;
  onTogglePlay: () => void;
  isPlaying: boolean;
  onReset: () => void;
  compact?: boolean; // For mobile view
}

const SUGGESTED_THEMES = [
    { en: "SOLAR FLARE", cn: "太阳耀斑" },
    { en: "FROZEN NOVA", cn: "冰霜新星" },
    { en: "VOID LOTUS", cn: "虚空莲华" },
    { en: "CYBER STORM", cn: "赛博风暴" },
    { en: "MATRIX RAIN", cn: "矩阵代码" }
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onGenerate, 
  isGenerating, 
  onTogglePlay, 
  isPlaying, 
  onReset,
  compact = false
}) => {
  const [theme, setTheme] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim()) {
      onGenerate(theme);
    }
  };

  if (compact) {
      return (
        <button 
            onClick={() => onReset()}
            className="flex-1 bg-red-900/50 border border-red-500 text-red-500 p-2 font-display uppercase text-xs tracking-wider"
        >
            Reset / 重置
        </button>
      )
  }

  return (
    <div className="border border-[#333] bg-black/80 p-6 cyber-clip relative group">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39ff14]"></div>

      <h2 className="text-sm font-display text-[#39ff14] font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
        <span className="animate-pulse">►</span> COMMAND INPUT
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative group/input">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#333] to-[#111] rounded-sm -z-10 group-hover/input:from-[#39ff14] group-hover/input:to-[#111] transition-colors duration-500"></div>
            <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="INPUT KEYWORD // 输入关键词..."
                className="w-full bg-[#050505] border-none text-[#fcee0a] p-3 focus:outline-none focus:ring-1 focus:ring-[#fcee0a] transition-all font-sans-cn font-bold placeholder:text-gray-700 placeholder:font-mono uppercase tracking-wide"
                disabled={isGenerating}
                autoComplete="off"
            />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_THEMES.map((item) => (
                <button
                    key={item.en}
                    type="button"
                    onClick={() => setTheme(item.cn)}
                    className="group/tag flex items-center bg-[#0a0a0a] border border-[#222] px-2 py-1 hover:border-[#39ff14] transition-all cursor-pointer hover:bg-[#111]"
                >
                    <span className="text-[7px] text-[#444] font-mono mr-2 group-hover/tag:text-[#39ff14] tracking-wider">{item.en}</span>
                    <span className="text-[10px] text-[#777] font-sans-cn group-hover/tag:text-white">{item.cn}</span>
                </button>
            ))}
        </div>
        
        <button
            type="submit"
            disabled={isGenerating || !theme.trim()}
            className={`w-full py-4 font-bold text-black uppercase tracking-widest font-display cyber-clip-btn transition-all relative overflow-hidden group/btn
              ${isGenerating || !theme.trim() 
                ? 'bg-[#222] text-[#555] cursor-not-allowed' 
                : 'bg-[#39ff14] hover:bg-white'
              }`}
        >
            <div className="relative z-10 flex flex-col items-center justify-center leading-none">
                <span className="text-lg group-hover/btn:glitch-hover">
                    {isGenerating ? 'PROCESSING...' : 'EXECUTE'}
                </span>
                <span className="text-[10px] scale-75 font-sans-cn font-bold tracking-[0.2em]">
                    {isGenerating ? '生成运算中' : '执行生成程序'}
                </span>
            </div>
            {/* Hover scan effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-100"></div>
        </button>
      </form>

      <div className="my-6 border-t border-dashed border-[#333]"></div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 gap-3">
         <div className="col-span-2 bg-[#111] p-3 border border-[#222]">
            <div className="text-[10px] text-[#555] font-display mb-2 uppercase tracking-widest border-b border-[#222] pb-1">Protocols // 协议</div>
            
            <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-[#aaa] font-mono">WASD</div>
                <div className="text-[#39ff14] text-right font-sans-cn font-bold">移动 // MOVE</div>
                
                <div className="text-[#aaa] font-mono">SHIFT</div>
                <div className="text-[#39ff14] text-right font-sans-cn font-bold">聚焦 // FOCUS</div>
                
                <div className="text-[#aaa] font-mono">[ X ]</div>
                <div className="text-[#fcee0a] text-right font-sans-cn font-bold">闪避 // DASH</div>
            </div>
         </div>

        <button
          onClick={onTogglePlay}
          className={`p-3 font-bold border-2 transition-all uppercase tracking-wide text-xs font-display cyber-clip-btn flex flex-col items-center justify-center gap-1
            ${isPlaying 
              ? 'border-[#fcee0a] text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black' 
              : 'border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black'
            }`}
        >
          <span>{isPlaying ? 'SUSPEND' : 'RESUME'}</span>
          <span className="text-[8px] scale-90 font-sans-cn">{isPlaying ? '挂起' : '恢复'}</span>
        </button>
        <button
          onClick={onReset}
          className="p-3 font-bold border-2 border-[#ff0055] text-[#ff0055] hover:bg-[#ff0055] hover:text-black transition-all uppercase tracking-wide text-xs font-display cyber-clip-btn flex flex-col items-center justify-center gap-1"
        >
          <span>PURGE</span>
          <span className="text-[8px] scale-90 font-sans-cn">清除</span>
        </button>
      </div>
    </div>
  );
};
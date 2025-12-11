import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { ControlPanel } from './components/ControlPanel';
import { PatternInfo } from './components/PatternInfo';
import { Readme } from './components/Readme';
import { generatePattern } from './services/geminiService';
import { PatternConfig, GameStats } from './types';

function App() {
  const [pattern, setPattern] = useState<PatternConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({ bulletCount: 0, fps: 60 });
  const [showReadme, setShowReadme] = useState(false);

  const handleGenerate = async (theme: string) => {
    setIsGenerating(true);
    setPattern(null);
    setIsPlaying(false);
    
    try {
      const newPattern = await generatePattern(theme);
      setPattern(newPattern);
      setIsPlaying(true);
    } catch (err) {
      console.error("Failed to generate pattern", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden text-[#e0e0e0]">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
            backgroundImage: `
                linear-gradient(rgba(57, 255, 20, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(57, 255, 20, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />
      
      {/* CRT Scanlines Overlay (Global) */}
      <div className="absolute inset-0 z-50 pointer-events-none crt-overlay mix-blend-overlay opacity-50"></div>

      {/* Main HUD Container */}
      <div className="relative z-10 flex flex-1 p-2 lg:p-6 gap-6 h-full max-w-[1920px] mx-auto">
        
        {/* Left Sidebar: Controls & Info */}
        <div className="hidden lg:flex flex-col w-[350px] gap-4 shrink-0 h-full">
            {/* Branding */}
            <div className="border-l-4 border-[#39ff14] pl-4 py-2 bg-black/40 backdrop-blur-sm">
                <h1 className="text-4xl font-display font-black tracking-tighter text-white leading-none">
                    NEON<br/><span className="text-[#39ff14]">BARRAGE</span>
                </h1>
                <div className="text-[10px] font-mono text-[#39ff14] tracking-[0.2em] mt-1 font-bold uppercase">
                    AI CYBER SURVIVAL // AI弹幕生成赛博生存战
                </div>
            </div>

            <ControlPanel 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                isPlaying={isPlaying}
                onReset={() => {
                    setPattern(null);
                    setGameStats({ bulletCount: 0, fps: 0 });
                }}
            />
            
            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                <PatternInfo pattern={pattern} stats={gameStats} />
            </div>

            {/* Bottom Status Block */}
            <div className="text-[10px] text-gray-500 border border-gray-800 p-2 bg-black font-mono">
                <div className="flex justify-between">
                    <span>SYS.STATUS</span>
                    <span className="text-[#39ff14]">ONLINE // 正常</span>
                </div>
                <div className="flex justify-between">
                    <span>MEM.ALLOC</span>
                    <span>{Math.floor(Math.random() * 50) + 20}%</span>
                </div>
                <div className="w-full h-[1px] bg-[#333] my-1"></div>
                <div className="flex justify-between items-center">
                    <button onClick={() => setShowReadme(true)} className="hover:text-[#39ff14] hover:bg-[#111] px-1 transition-colors">
                        [ MANUAL // 操作手册 ]
                    </button>
                    <span>LATENCY: 12ms</span>
                </div>
            </div>
        </div>

        {/* Center: The Game (Full Height) */}
        <div className="flex-1 relative flex flex-col h-full border-x border-[#333] bg-black/20">
            {/* Top Warning Bar */}
            <div className="h-8 bg-[#fcee0a] text-black font-bold font-mono flex items-center justify-between px-2 overflow-hidden text-xs lg:text-sm">
                <div className="flex gap-4 animate-pulse whitespace-nowrap">
                    <span>WARNING: LIVE FIRE EXERCISE</span>
                    <span>//</span>
                    <span className="font-sans-cn tracking-widest font-black">警告：实弹演习进行中</span>
                </div>
                <div className="whitespace-nowrap font-bold">REC ●</div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
                 <GameCanvas 
                    pattern={pattern} 
                    isPlaying={isPlaying} 
                    onStatsUpdate={setGameStats}
                />
            </div>
            
             {/* Mobile/Tablet Controls Fallback (Bottom) */}
            <div className="lg:hidden absolute bottom-4 left-4 right-4 flex gap-2">
                <button 
                    onClick={() => setShowReadme(true)}
                    className="flex-1 bg-black border border-[#39ff14] text-[#39ff14] p-2 font-display uppercase text-xs"
                >
                    Manual // 手册
                </button>
                 <ControlPanel 
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    isPlaying={isPlaying}
                    onReset={() => {
                        setPattern(null);
                        setGameStats({ bulletCount: 0, fps: 0 });
                    }}
                    compact={true}
                />
            </div>
        </div>

        {/* Right Decorative Sidebar (Desktop only) */}
        <div className="hidden lg:flex w-[200px] flex-col justify-between py-12 border-l border-[#222] pl-6 text-[#444]">
            <div className="space-y-12">
                <div className="writing-vertical-rl text-4xl font-display font-bold tracking-widest text-[#222] uppercase">
                    MADE BY HAOZE ZHENG
                </div>
                <div className="space-y-2 font-mono text-xs">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            <span>{`0${i}X`}:</span>
                            <span className="w-full bg-[#111] h-3 block animate-pulse" style={{width: `${Math.random() * 100}%`}}></span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="border border-[#222] p-2">
                <div className="w-full h-[100px] bg-[repeating-linear-gradient(45deg,#111,#111_10px,#000_10px,#000_20px)] opacity-50"></div>
            </div>
        </div>
      </div>

      {showReadme && <Readme onClose={() => setShowReadme(false)} />}
    </div>
  );
}

export default App;
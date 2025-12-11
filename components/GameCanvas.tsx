import React, { useRef, useEffect } from 'react';
import { PatternConfig, GameState } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { useGameEngine } from '../hooks/useGameEngine';

interface GameCanvasProps {
  pattern: PatternConfig | null;
  isPlaying: boolean;
  onStatsUpdate: (stats: { bulletCount: number; fps: number }) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ pattern, isPlaying, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, resetGame } = useGameEngine(canvasRef, pattern, isPlaying);

  useEffect(() => {
    onStatsUpdate({ bulletCount: gameState.bulletCount, fps: gameState.fps });
  }, [gameState, onStatsUpdate]);

  return (
    <div className="relative group max-h-full aspect-[3/4] flex justify-center">
        {/* Hardware Frame */}
        <div className="absolute -inset-1 bg-[#111] cyber-clip border border-[#333] z-0 shadow-2xl"></div>
        <div className="absolute -inset-[2px] bg-gradient-to-b from-[#39ff14] to-transparent opacity-20 z-0 pointer-events-none mix-blend-screen"></div>

        {/* Corner Decorations */}
        <svg className="absolute -top-3 -left-3 w-8 h-8 text-[#39ff14] z-20 opacity-80" viewBox="0 0 40 40">
            <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" fill="currentColor"/>
        </svg>
        <svg className="absolute -top-3 -right-3 w-8 h-8 text-[#39ff14] z-20 transform rotate-90 opacity-80" viewBox="0 0 40 40">
            <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" fill="currentColor"/>
        </svg>
        <svg className="absolute -bottom-3 -left-3 w-8 h-8 text-[#39ff14] z-20 transform -rotate-90 opacity-80" viewBox="0 0 40 40">
            <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" fill="currentColor"/>
        </svg>
        <svg className="absolute -bottom-3 -right-3 w-8 h-8 text-[#39ff14] z-20 transform rotate-180 opacity-80" viewBox="0 0 40 40">
            <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" fill="currentColor"/>
        </svg>

        {/* HUD - Top Left: Score */}
        <div className="absolute top-4 left-4 z-10 font-display">
            <div className="flex items-center gap-2 mb-[-4px]">
                <div className="w-2 h-2 bg-[#39ff14] animate-pulse"></div>
                <div className="text-[10px] text-[#39ff14] uppercase tracking-widest font-bold">SCORE // 得分</div>
            </div>
            <div className="text-3xl text-white font-bold tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] font-mono">
                {gameState.score.toString().padStart(7, '0')}
            </div>
            <div className="h-[2px] w-full bg-[#39ff14] mt-1 shadow-[0_0_8px_#39ff14]"></div>
        </div>

        {/* HUD - Bottom Center: Dash/Energy */}
        <div className="absolute bottom-6 left-10 right-10 z-10 flex flex-col items-center">
             <div className="w-full h-3 bg-[#000] border border-[#444] skew-x-[-20deg] overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                {/* Background Grid inside bar */}
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>
                
                <div 
                    className={`h-full transition-all duration-100 ease-out relative ${gameState.dashCooldown >= 1 ? 'bg-[#fcee0a] shadow-[0_0_10px_#fcee0a]' : 'bg-[#333]'}`}
                    style={{ width: `${gameState.dashCooldown * 100}%` }}
                >
                    {/* Stripes on the bar */}
                    {gameState.dashCooldown >= 1 && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)]"></div>
                    )}
                </div>
             </div>
             <div className="flex justify-between w-full mt-1 text-[10px] font-display uppercase tracking-widest text-[#fcee0a] px-2 shadow-black drop-shadow-sm">
                 <span className="font-bold">HYPER.DRIVE</span>
                 <span className={`${gameState.dashCooldown >= 1 ? 'animate-pulse text-white font-bold' : 'text-gray-600'} font-sans-cn tracking-wider`}>
                    {gameState.dashCooldown >= 1 ? '就绪 [X]' : '充能中...'}
                 </span>
             </div>
        </div>

        {/* Canvas Itself */}
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block h-full w-auto object-contain bg-[#050505] cursor-crosshair z-0"
            style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Game Over Screen */}
        {gameState.isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                <div className="border-y-2 border-[#ff00ff] bg-black/95 p-8 w-full text-center animate-[glitch_0.3s_infinite] shadow-[0_0_50px_rgba(255,0,255,0.2)]">
                    <h2 className="text-5xl font-display font-black text-[#ff00ff] mb-2 tracking-tighter neon-text">
                        SYSTEM HALT
                    </h2>
                    <div className="text-xl font-sans-cn font-black text-white tracking-[0.5em] uppercase mb-8">
                        任务失败
                    </div>
                    
                    <div className="inline-block border border-[#333] bg-[#111] p-4 mb-8 min-w-[200px]">
                        <div className="text-xs text-gray-500 font-display uppercase tracking-widest mb-2">Final Metric</div>
                        <div className="text-4xl font-mono text-[#fcee0a] tracking-wider">{gameState.score}</div>
                    </div>

                    <button 
                        onClick={resetGame}
                        className="group relative px-10 py-3 bg-[#ff00ff] text-black font-bold uppercase tracking-widest font-display hover:bg-white transition-colors cyber-clip-btn"
                    >
                        <span className="relative z-10 group-hover:glitch-hover">REBOOT // 重启</span>
                    </button>
                </div>
            </div>
        )}

        {/* Idle Screen */}
        {!pattern && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm z-20">
                <div className="w-16 h-16 border-2 border-dashed border-[#39ff14] rounded-full animate-[spin_4s_linear_infinite] mb-4 opacity-50"></div>
                <div className="text-[#39ff14] font-mono text-sm animate-pulse tracking-widest uppercase mb-1">
                    AWAITING INPUT
                </div>
                 <div className="text-[#39ff14] font-sans-cn text-lg font-bold tracking-[0.2em] shadow-black drop-shadow-md">
                    等待数据流接入
                </div>
            </div>
        )}
    </div>
  );
};
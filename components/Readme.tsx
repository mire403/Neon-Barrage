import React from 'react';

interface ReadmeProps {
  onClose: () => void;
}

export const Readme: React.FC<ReadmeProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl border-2 border-[#39ff14] bg-[#050505] relative shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        {/* Header decoration */}
        <div className="bg-[#39ff14] h-8 flex items-center justify-between px-4">
             <span className="text-black font-bold font-display uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-black animate-pulse"></span>
                SYSTEM_MANUAL_v1.0
             </span>
             <button 
                onClick={onClose}
                className="text-black hover:bg-black hover:text-[#39ff14] px-2 font-bold font-mono"
            >
                [ ESC ]
            </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto font-sans-cn text-gray-300">
          <section className="mb-8">
            <h3 className="text-xl text-white font-display font-bold mb-4 border-l-4 border-[#ff00ff] pl-3 flex items-center gap-2">
                <span className="text-[#ff00ff] text-sm font-mono">01 //</span> 初始化 <span className="text-gray-600 text-sm font-display">INITIALIZATION</span>
            </h3>
            <p className="text-sm leading-loose text-[#aaa] tracking-wide">
              欢迎来到 <strong className="text-white">NEON BARRAGE</strong> 模拟环境。该接口直接连接至 <span className="text-[#39ff14]">Gemini 2.5</span> 生成核心，实时构建高维弹道防御模式。系统将根据语义指令生成对应的视觉威胁。
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl text-white font-display font-bold mb-4 border-l-4 border-[#ff00ff] pl-3 flex items-center gap-2">
                <span className="text-[#ff00ff] text-sm font-mono">02 //</span> 协议 <span className="text-gray-600 text-sm font-display">PROTOCOLS</span>
            </h3>
            <ul className="text-sm space-y-6">
              <li className="flex gap-4 items-start">
                  <span className="text-[#39ff14] font-mono mt-1">>>></span>
                  <div>
                      <strong className="text-white block font-display tracking-wider mb-1 text-xs">INPUT // 指令输入</strong>
                      <span className="text-[#aaa] leading-relaxed">
                        在控制终端输入<span className="text-white">主题关键词</span>（如“太阳耀斑”、“故障风暴”）。生成核心将解析语义并构建对应的几何弹幕。
                      </span>
                  </div>
              </li>
              <li className="flex gap-4 items-start">
                  <span className="text-[#39ff14] font-mono mt-1">>>></span>
                  <div>
                      <strong className="text-white block font-display tracking-wider mb-1 text-xs">SURVIVAL // 生存策略</strong>
                      <span className="text-[#aaa] leading-relaxed">
                        使用 <span className="text-[#39ff14] font-bold font-mono">[WASD]</span> 移动，<span className="text-[#39ff14] font-bold font-mono">[SHIFT]</span> 进行低速精密操作。
                        当充能完毕时，按 <span className="text-[#fcee0a] font-bold font-mono">[X]</span> 激活超速闪避（无敌帧）。
                      </span>
                  </div>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-white font-display font-bold mb-4 border-l-4 border-[#ff00ff] pl-3 flex items-center gap-2">
                <span className="text-[#ff00ff] text-sm font-mono">03 //</span> 数据 <span className="text-gray-600 text-sm font-display">DATA TYPES</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="border border-[#333] p-3 bg-[#111]">
                    <span className="text-[#00ffff] block mb-2 font-display tracking-wider">RANK // 威胁等级</span>
                    <div className="space-y-1 text-[#666]">
                        <div className="text-[#39ff14]">EASY</div>
                        <div className="text-[#00ffff]">NORMAL</div>
                        <div className="text-[#fcee0a]">HARD</div>
                        <div className="text-[#ff00ff]">LUNATIC</div>
                    </div>
                </div>
                <div className="border border-[#333] p-3 bg-[#111]">
                    <span className="text-[#00ffff] block mb-2 font-display tracking-wider">CLASS // 发射器</span>
                    <div className="text-[#888] leading-relaxed">
                        RING / SPIRAL / SPREAD <br/> AIMED / FLOWER / RANDOM
                    </div>
                </div>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-[#222] text-center bg-black/50">
            <button 
                onClick={onClose}
                className="bg-[#222] text-white hover:bg-[#39ff14] hover:text-black px-12 py-3 font-display uppercase tracking-widest cyber-clip-btn transition-colors text-xs font-bold"
            >
                ACKNOWLEDGE // 确认知悉
            </button>
        </div>
      </div>
    </div>
  );
};
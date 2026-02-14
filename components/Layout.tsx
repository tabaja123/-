
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNavigate: (step: number) => void;
  score: number;
  onModeSwitch?: () => void;
  onPresentationStart?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, currentStep, totalSteps, onNavigate, score, onModeSwitch, onPresentationStart 
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col py-4 md:py-8" dir="rtl">
      <div className="max-w-5xl mx-auto w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[90vh]">
        
        <header className="bg-gradient-to-r from-blue-900 to-blue-600 p-8 md:p-10 text-white text-center relative overflow-hidden" role="banner">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">نشاط التنظيم الذاتي</h1>
              <div className="flex gap-2">
                <button 
                  onClick={onPresentationStart}
                  className="text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold transition"
                >
                  📽️ عرض شرح المحاضر
                </button>
                <button 
                  onClick={onModeSwitch}
                  className="text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold transition"
                >
                  👨‍🏫 دخول المحاضر
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex flex-col items-center min-w-[140px] shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">الدرجة المقدرة</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-white">{score}</span>
                  <span className="text-sm font-bold opacity-60">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-1000 ease-out" 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-slate-50 px-8 py-6 border-b flex flex-col gap-4 text-right" aria-label="تقدم النشاط">
          <div className="flex justify-between items-center max-w-md mx-auto w-full mb-1">
             {Array.from({ length: totalSteps }).map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => onNavigate(i + 1)}
                 aria-label={`انتقل إلى المرحلة ${i + 1}`}
                 className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${currentStep === i + 1 ? 'bg-blue-600 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-slate-300 hover:bg-slate-400'}`}
               ></button>
             ))}
          </div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            المرحلة {currentStep} من أصل {totalSteps}
          </div>
        </nav>

        <main className="flex-grow p-6 md:p-12 text-right overflow-y-auto" role="main">
          {children}
        </main>

        <footer className="p-8 border-t border-slate-200 flex justify-between items-center bg-white" role="contentinfo">
          <button
            onClick={() => onNavigate(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-8 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold disabled:opacity-50 hover:bg-slate-200 transition-all"
          >
            السابق
          </button>
          
          <div className="flex gap-4">
            {currentStep < totalSteps ? (
              <button
                onClick={() => onNavigate(currentStep + 1)}
                className="px-12 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl transition-all"
              >
                التالي
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

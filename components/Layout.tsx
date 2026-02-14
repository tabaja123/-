
import React from 'react';
import { Language } from '../types';
import { translations } from '../locales';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNavigate: (step: number) => void;
  score: number;
  onModeSwitch?: () => void;
  onPresentationStart?: () => void;
  language: Language;
  onLanguageToggle: () => void;
  isLocked?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, currentStep, totalSteps, onNavigate, score, onModeSwitch, onPresentationStart, language, onLanguageToggle, isLocked 
}) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col py-4 md:py-8" dir="rtl">
      {/* Floating Language Switcher */}
      {!isLocked && (
        <div className="fixed bottom-6 left-6 z-[100]">
          <button 
            onClick={onLanguageToggle}
            className="bg-amber-400 hover:bg-amber-300 text-blue-900 px-6 py-3 rounded-2xl font-black shadow-2xl transition-all border-4 border-white flex items-center gap-2 text-lg active:scale-95"
          >
            <span className="text-xl">🌍</span>
            <span>{t.languageToggle}</span>
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[90vh] relative">
        
        <header className="bg-gradient-to-r from-blue-900 to-blue-600 p-8 md:p-10 text-white text-center relative overflow-hidden" role="banner">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>
          
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-right flex-grow">
              <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight">{t.title}</h1>
              <p className="text-blue-200 font-bold mb-4 text-base opacity-90">{t.subtitle}</p>
              
              {!isLocked && (
                <div className="flex flex-wrap gap-3 justify-start">
                  <button 
                    onClick={onPresentationStart} 
                    className="bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-xl font-bold transition text-sm flex items-center gap-2 shadow-sm"
                  >
                    <span>📽️</span> {t.presentationStart}
                  </button>
                  <button 
                    onClick={onModeSwitch} 
                    className="bg-amber-500 hover:bg-amber-400 text-blue-900 px-4 py-2 rounded-xl font-black transition text-sm flex items-center gap-2 shadow-lg"
                  >
                    <span>👨‍🏫</span> {t.lecturerEntry}
                  </button>
                </div>
              )}
              {isLocked && (
                <div className="bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                  <span className="text-emerald-400 text-sm font-black">✅ ההגשה ננעלה בהצלחה</span>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-[2rem] flex flex-col items-center min-w-[140px] shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{t.estimatedGrade}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black text-white">{score}</span>
                <span className="text-sm font-bold opacity-60">/ 100</span>
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-slate-50 px-8 py-4 border-b flex flex-col gap-2 text-center">
          <div className="flex justify-between items-center max-w-xs mx-auto w-full mb-1">
             {Array.from({ length: totalSteps }).map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => !isLocked && onNavigate(i + 1)}
                 disabled={isLocked}
                 className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep === i + 1 ? 'bg-blue-600 scale-125 shadow-md' : 'bg-slate-300 hover:bg-slate-400'} ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
               ></button>
             ))}
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t.step} {currentStep} {t.of} {totalSteps}
          </div>
        </nav>

        <main className="flex-grow p-6 md:p-10 text-right overflow-y-auto">
          {children}
        </main>

        <footer className="p-8 border-t border-slate-50 flex justify-between items-center bg-white">
          <button
            onClick={() => !isLocked && onNavigate(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLocked}
            className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-black disabled:opacity-30 hover:bg-slate-200 transition-all text-sm"
          >
            {t.prev}
          </button>
          
          {currentStep < totalSteps && !isLocked && (
            <button
              onClick={() => onNavigate(currentStep + 1)}
              className="px-12 py-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl transition-all active:scale-95 text-sm"
            >
              {t.next}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Layout;

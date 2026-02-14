
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, FeedbackData, Language } from './types';
import { translations } from './locales';
import Layout from './components/Layout';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step34 from './components/steps/Step34';
import Step5 from './components/steps/Step5';
import Step6 from './components/steps/Step6';
import TeacherDashboard from './components/TeacherDashboard';
import PresentationMode from './components/PresentationMode';

const STORAGE_KEY = 'self_regulation_app_state_v2';
const TEACHER_PASSWORD = 'Lecturer2025';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'student' | 'teacher' | 'presentation'>('student');
  const [importedState, setImportedState] = useState<AppState | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation to ensure we have a valid state object
        if (parsed && typeof parsed.step === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
    
    return {
      step: 1,
      language: 'ar',
      student: { fullName: '', studentId: '', email: '' },
      emotions: [],
      answers: new Array(20).fill(''),
      reframing: translations['ar'].thought_pairs,
      selectedTools: [],
      isSubmitted: false
    };
  });

  useEffect(() => {
    if (viewMode === 'student') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, viewMode]);

  const toggleLanguage = () => {
    const nextLang: Language = state.language === 'ar' ? 'he' : 'ar';
    updateState({ language: nextLang, reframing: translations[nextLang].thought_pairs });
  };

  const t = translations[state.language];
  const currentData = importedState || state;

  const score = useMemo(() => {
    if (currentData?.feedback) return currentData.feedback.finalGrade;
    let total = 0;
    const data = currentData;
    
    if (data?.student?.fullName?.length > 2) total += 10;
    if (data?.emotions?.length >= 3) total += 10;
    if (data?.answers?.[1]?.trim().length > 10) total += 5;
    if (data?.answers?.[2]?.trim().length > 10) total += 5;
    if (data?.answers?.[3]?.trim().length > 10) total += 5;
    if (data?.answers?.[5]?.trim().length > 20) total += 10;
    if (data?.answers?.[8]?.trim().length > 20) total += 7;
    if (data?.answers?.[10]?.trim().length > 20) total += 8;
    if (data?.answers?.[11]?.trim().length > 10) total += 4;
    if (data?.answers?.[12]?.trim().length > 10) total += 4;
    if (data?.answers?.[13]?.trim().length > 10) total += 4;
    if (data?.answers?.[14]?.trim().length > 10) total += 4;
    if (data?.answers?.[15]?.trim().length > 10) total += 4;
    if (data?.answers?.[16]?.trim().length > 10) total += 5;
    if (data?.answers?.[17]?.trim().length > 10) total += 5;
    if (data?.answers?.[18]?.trim().length > 10) total += 5;
    if (data?.answers?.[19]?.trim().length > 10) total += 5;
    
    return Math.min(100, total);
  }, [currentData]);

  const updateState = (updates: Partial<AppState>) => setState(prev => ({ ...prev, ...updates }));
  const updateAnswer = (index: number, value: string) => {
    if (state.isSubmitted) return; 
    const newAnswers = [...state.answers];
    newAnswers[index] = value;
    updateState({ answers: newAnswers });
  };

  const safeAtob = (code: string) => {
    try {
      const cleanCode = code.trim().replace(/\s/g, '');
      return decodeURIComponent(atob(cleanCode).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) { throw e; }
  };

  const handleImport = (code: string) => {
    try { 
      const decoded = JSON.parse(safeAtob(code));
      setImportedState(decoded); 
    } catch (e) { alert(state.language === 'ar' ? "الكود غير صالح" : "הקוד לא תקין"); }
  };

  const handleImportFeedback = () => {
    try {
      const fb = JSON.parse(safeAtob(feedbackInput)) as FeedbackData;
      updateState({ feedback: fb, step: 1 });
      setFeedbackInput('');
    } catch (e) { alert("שגיאה בייבוא משוב"); }
  };

  const handleTeacherAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === TEACHER_PASSWORD) { 
      setIsTeacherAuthenticated(true); 
      setAuthError(false); 
    } else { 
      setAuthError(true); 
      setPasswordInput(''); 
    }
  };

  const enterTeacherMode = () => {
    setAuthError(false);
    setPasswordInput('');
    setViewMode('teacher');
  };

  if (viewMode === 'presentation') return <PresentationMode onExit={() => setViewMode('student')} />;
  
  if (viewMode === 'teacher') {
    if (!isTeacherAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6" dir="rtl">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-right animate-fade-in border-4 border-blue-500/20">
            <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">כניסת מרצה 🔐</h2>
            <form onSubmit={handleTeacherAuth} className="space-y-4">
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className={`w-full p-5 rounded-2xl border-2 outline-none text-center text-2xl tracking-widest ${authError ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} 
                placeholder="••••••••" 
                autoFocus 
              />
              {authError && <p className="text-red-500 text-center font-bold text-sm">סיסמה שגויה</p>}
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all">כניסה</button>
            </form>
            <button onClick={() => setViewMode('student')} className="w-full mt-6 text-slate-400 font-bold underline text-center">חזרה לתצוגת סטודנט</button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-900 p-0 md:p-8 flex items-center justify-center">
        {!importedState ? (
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-right animate-fade-in" dir="rtl">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
               <h2 className="text-3xl font-black text-slate-800">בדיקת עבודות וניהול</h2>
               <div className="flex gap-4">
                 <button onClick={() => setImportedState(state)} className="text-blue-600 text-xs font-bold underline">ניהול הגדרות הפרויקט</button>
                 <button onClick={() => setIsTeacherAuthenticated(false)} className="text-red-500 text-xs font-bold underline">התנתק</button>
               </div>
            </div>
            <p className="text-slate-600 mb-6 font-bold">הדבק את קוד ההגשה של הסטודנט לבדיקה:</p>
            <textarea className="w-full h-40 p-5 border-2 rounded-2xl mb-6 bg-slate-50 font-mono text-[10px]" placeholder="הדבק קוד כאן..." id="importCode"></textarea>
            <button onClick={() => handleImport((document.getElementById('importCode') as HTMLTextAreaElement).value)} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-blue-700 transition">טען עבודה 🚀</button>
            <button onClick={() => setViewMode('student')} className="w-full mt-8 text-slate-400 underline text-center">חזרה לתצוגת סטודנט</button>
          </div>
        ) : (
          <TeacherDashboard 
            state={importedState} 
            score={score} 
            onBack={() => setImportedState(null)} 
            onUpdateProject={(updates) => {
              updateState(updates);
              setImportedState(prev => prev ? { ...prev, ...updates } : null);
            }}
          />
        )}
      </div>
    );
  }

  const currentStep = state.isSubmitted ? 6 : state.step;

  return (
    <Layout 
      currentStep={currentStep} 
      totalSteps={6} 
      onNavigate={(s) => !state.isSubmitted && updateState({ step: s })} 
      score={score} 
      onModeSwitch={enterTeacherMode} 
      onPresentationStart={() => setViewMode('presentation')} 
      language={state.language} 
      onLanguageToggle={toggleLanguage}
      isLocked={state.isSubmitted}
    >
      {currentStep === 1 && !state.feedback && (
        <div className="mb-8 bg-blue-50/50 border-2 border-blue-200 rounded-[2.5rem] p-8 text-right animate-fade-in">
          <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">📩 {(t as any).feedback_title}</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="text" value={feedbackInput} onChange={(e) => setFeedbackInput(e.target.value)} placeholder={(t as any).feedback_placeholder} className="flex-grow p-4 rounded-xl border-2 outline-none text-right shadow-sm focus:border-blue-400" />
            <button onClick={handleImportFeedback} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all">{(t as any).feedback_btn}</button>
          </div>
        </div>
      )}
      {currentStep === 1 && state.feedback && (
        <div className="mb-8 bg-indigo-800 p-8 rounded-[3rem] text-white shadow-xl animate-fade-in text-right">
          <h3 className="text-2xl font-black mb-4">{(state.language === 'ar' ? 'نتائج التقييم' : 'תוצאות הערכת המרצה')}</h3>
          <p className="text-xl italic mb-6">"{state.feedback.comments}"</p>
          <div className="bg-white text-indigo-900 p-6 rounded-2xl flex items-center justify-between">
            <div className="text-4xl font-black">{state.feedback.finalGrade} / 100</div>
            <button onClick={() => updateState({ feedback: undefined })} className="text-sm font-bold underline">הסתר</button>
          </div>
        </div>
      )}
      {currentStep === 1 && <Step1 language={state.language} data={state.student} answer={state.answers[0]} onAnswerChange={(val) => updateAnswer(0, val)} onChange={(student) => updateState({ student })} onNext={() => updateState({ step: 2 })} />}
      {currentStep === 2 && <Step2 language={state.language} emotions={state.emotions} answers={state.answers.slice(1, 5)} onAnswerChange={(idx, val) => updateAnswer(idx + 1, val)} onUpdate={updateState} />}
      {currentStep === 3 && <Step34 language={state.language} answers={state.answers.slice(5, 8)} onAnswerChange={(idx, val) => updateAnswer(idx + 5, val)} isStep4={false} />}
      {currentStep === 4 && <Step34 language={state.language} answers={state.answers.slice(8, 11)} onAnswerChange={(idx, val) => updateAnswer(idx + 8, val)} isStep4={true} />}
      {currentStep === 5 && <Step5 language={state.language} reframing={state.reframing} selectedTools={state.selectedTools} answers={state.answers.slice(11, 16)} onAnswerChange={(idx, val) => updateAnswer(idx + 11, val)} onUpdate={updateState} />}
      {currentStep === 6 && <Step6 language={state.language} state={state} answers={state.answers.slice(16, 20)} onAnswerChange={(idx, val) => updateAnswer(idx + 16, val)} isSubmitted={state.isSubmitted} onUpdate={updateState} studentName={state.student.fullName} />}
    </Layout>
  );
};

export default App;

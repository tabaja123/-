
import React, { useState, useEffect, useMemo } from 'react';
import { AppState } from './types';
import { INITIAL_THOUGHT_PAIRS } from './constants';
import Layout from './components/Layout';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step34 from './components/steps/Step34';
import Step5 from './components/steps/Step5';
import Step6 from './components/steps/Step6';
import TeacherDashboard from './components/TeacherDashboard';
import PresentationMode from './components/PresentationMode';

const STORAGE_KEY = 'self_regulation_app_state';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'student' | 'teacher' | 'presentation'>('student');
  const [importedState, setImportedState] = useState<AppState | null>(null);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      step: 1,
      student: { fullName: '', studentId: '' },
      emotions: [],
      answers: new Array(18).fill(''),
      reframing: INITIAL_THOUGHT_PAIRS,
      selectedTools: [],
      isSubmitted: false
    };
  });

  useEffect(() => {
    if (viewMode === 'student') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, viewMode]);

  const currentData = importedState || state;

  const score = useMemo(() => {
    let total = 0;
    const data = currentData;
    if (data.student.fullName.length > 2) total += 10;
    if (data.emotions.length >= 3) total += 10;
    data.answers.forEach((a, i) => { 
      if (a?.trim().length > 15) total += 4; 
      if (a?.trim().length > 40) total += 1; // Extra credit for depth
    });
    return Math.min(100, total);
  }, [currentData]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...state.answers];
    newAnswers[index] = value;
    updateState({ answers: newAnswers });
  };

  const handleImport = (code: string) => {
    try {
      const decoded = JSON.parse(atob(code));
      setImportedState(decoded);
    } catch (e) {
      alert("קוד לא תקין. וודא שהעתקת את כל המחרוזת.");
    }
  };

  if (viewMode === 'presentation') {
    return <PresentationMode onExit={() => setViewMode('student')} />;
  }

  if (viewMode === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-900">
        {!importedState ? (
          <div className="flex flex-col items-center justify-center h-screen p-6 text-right" dir="rtl">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full">
              <h2 className="text-3xl font-black mb-6 text-slate-800">כניסת מרצה</h2>
              <p className="text-slate-500 mb-6">הדבק כאן את קוד ההגשה של הסטודנט כדי לצפות בתשובות ובציון:</p>
              <textarea 
                className="w-full h-32 p-4 border-2 border-slate-100 rounded-2xl mb-6 focus:border-blue-500 outline-none"
                placeholder="הדבק קוד כאן..."
                id="importCode"
              ></textarea>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleImport((document.getElementById('importCode') as HTMLTextAreaElement).value)}
                  className="flex-grow bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  טען נתונים
                </button>
                <button 
                  onClick={() => setViewMode('student')}
                  className="px-6 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        ) : (
          <TeacherDashboard 
            state={importedState} 
            score={score} 
            onBack={() => {setImportedState(null); setViewMode('student');}} 
          />
        )}
      </div>
    );
  }

  return (
    <Layout 
      currentStep={state.step} 
      totalSteps={6} 
      onNavigate={(s) => updateState({ step: s })} 
      score={score}
      onModeSwitch={() => setViewMode('teacher')}
      onPresentationStart={() => setViewMode('presentation')}
    >
      {state.step === 1 && (
        <Step1 
          data={state.student} 
          answer={state.answers[0]}
          onAnswerChange={(val) => updateAnswer(0, val)}
          onChange={(student) => updateState({ student })} 
          onNext={() => updateState({ step: 2 })} 
        />
      )}
      {state.step === 2 && (
        <Step2 
          emotions={state.emotions}
          answers={state.answers.slice(1, 5)}
          onAnswerChange={(idx, val) => updateAnswer(idx + 1, val)}
          onUpdate={(updates) => updateState(updates)}
        />
      )}
      {(state.step === 3 || state.step === 4) && (
        <Step34 
          answers={state.answers.slice(5, 10)}
          onAnswerChange={(idx, val) => updateAnswer(idx + 5, val)}
          isStep4={state.step === 4}
        />
      )}
      {state.step === 5 && (
        <Step5 
          reframing={state.reframing}
          selectedTools={state.selectedTools}
          answers={state.answers.slice(10, 15)}
          onAnswerChange={(idx, val) => updateAnswer(idx + 10, val)}
          onUpdate={(updates) => updateState(updates)}
        />
      )}
      {state.step === 6 && (
        <Step6 
          state={state}
          answers={state.answers.slice(15, 18)}
          onAnswerChange={(idx, val) => updateAnswer(idx + 15, val)}
          isSubmitted={state.isSubmitted}
          onUpdate={(updates) => updateState(updates)}
          studentName={state.student.fullName}
        />
      )}
    </Layout>
  );
};

export default App;

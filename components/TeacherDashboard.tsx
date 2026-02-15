
import React, { useState } from 'react';
import { AppState, FeedbackData } from '../types';

interface TeacherDashboardProps {
  state: AppState;
  score: number;
  onBack: () => void;
  onUpdateProject?: (updates: Partial<AppState>) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ state, score, onBack, onUpdateProject }) => {
  const [finalGrade, setFinalGrade] = useState(score);
  const [comments, setComments] = useState('');
  const [feedbackCode, setFeedbackCode] = useState('');
  const [activeTab, setActiveTab] = useState<'grading' | 'management'>('grading');

  const sections = [
    { title: "תיאור המקרה (שלב 1)", max: 10 },
    { title: "ניטור רגשות (שלב 2)", max: 5 },
    { title: "ניטור מחשבות (שלב 2)", max: 5 },
    { title: "ניטור צרכים (שלב 2)", max: 5 },
    { title: "בקרה וויסות (שלב 3)", max: 10 },
    { title: "הערכת תוצאה (שלב 4)", max: 7 },
    { title: "ניתוח לולאת משוב (שלב 4)", max: 8 },
    { title: "הבניה מחדש (שלב 5)", max: 4 },
    { title: "ויסות רגשי - כלים (שלב 5)", max: 4 },
    { title: "ניהול זמן - כלים (שלב 5)", max: 4 },
    { title: "מטרות וערכים - כלים (שלב 5)", max: 4 },
    { title: "תכנון והערכה - כלים (שלב 5)", max: 4 },
    { title: "סימני אזהרה (שלב 6)", max: 5 },
    { title: "צעד מעשי ראשון (שלב 6)", max: 5 },
    { title: "שמירה על התקדמות (שלב 6)", max: 5 },
    { title: "מה אעשה אחרת (שלב 6)", max: 5 }
  ];

  const safeBtoa = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  };

  const generateFeedback = () => {
    const feedback: FeedbackData = { finalGrade, comments, teacherName: "המרצה", timestamp: new Date().toLocaleDateString('he-IL') };
    setFeedbackCode(safeBtoa(JSON.stringify(feedback)));
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-blue-500 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg font-bold">T</div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">מרכז ניהול המרצה</h1>
              <p className="text-slate-500 font-medium">בדיקת עבודות וניהול למידה</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-slate-100 px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-200 transition-all">חזרה</button>
        </header>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('grading')} className={`px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'grading' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}>בדיקת עבודה</button>
          <button onClick={() => setActiveTab('management')} className={`px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'management' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}>גיבוי וניהול</button>
        </div>

        {activeTab === 'grading' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <h2 className="text-2xl font-black text-slate-800">תשובות: {state.student.fullName}</h2>
                  <div className="text-slate-400 font-mono text-xs">{state.student.studentId}</div>
                </div>
                <div className="space-y-6 max-h-[700px] overflow-y-auto px-4 custom-scrollbar">
                  {sections.map((sec, i) => (
                    <div key={i} className="p-6 rounded-2xl border-2 bg-slate-50 border-slate-100 group hover:border-blue-200 transition-colors">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase mb-3 inline-block">{sec.title}</span>
                      <p className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">{state.answers[i] || '---'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 p-8 rounded-[3rem] shadow-xl text-white h-fit">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><span>📝</span> ציון ומשוב</h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-400 mb-2">ציון סופי:</label>
                  <input 
                    type="number" 
                    value={finalGrade} 
                    onChange={(e) => setFinalGrade(parseInt(e.target.value))} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-5 text-4xl font-black text-emerald-400 text-center focus:border-emerald-500 outline-none" 
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-400 mb-2">הערות פדגוגיות:</label>
                  <textarea 
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm h-40 focus:border-blue-500 outline-none" 
                    placeholder="כתבו כאן משוב בונה לסטודנט..."
                  ></textarea>
                </div>
                
                {!feedbackCode ? (
                  <button onClick={generateFeedback} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95">צור קוד משוב ✨</button>
                ) : (
                  <div className="bg-white/10 p-6 rounded-2xl border border-emerald-500/30 text-center animate-fade-in">
                    <p className="text-xs text-emerald-400 font-bold mb-4">הקוד נוצר! שלחי אותו לסטודנט:</p>
                    <div className="bg-black/40 p-4 rounded-xl break-all text-[8px] font-mono mb-6 select-all text-slate-300">{feedbackCode}</div>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(feedbackCode); alert("קוד המשוב הועתק!");}} 
                      className="w-full py-4 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100"
                    >
                      📋 העתק קוד משוב
                    </button>
                    <button onClick={() => setFeedbackCode('')} className="mt-4 text-[10px] text-slate-400 underline">ערוך משוב שוב</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl animate-fade-in text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💾</div>
            <h2 className="text-3xl font-black mb-4">ניהול נתונים</h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">כאן תוכלי להוריד גיבוי של המערכת או לנהל את תבניות המשימה.</p>
            <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all">
              הורד גיבוי פרויקט (JSON)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

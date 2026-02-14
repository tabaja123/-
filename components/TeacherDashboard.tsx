
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
  const [templateText, setTemplateText] = useState(state.answers[0] || '');

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

  const exportProjectBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      config: state
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_project_regulation_${new Date().toLocaleDateString()}.json`;
    link.click();
  };

  const saveTemplate = () => {
    if (onUpdateProject) {
      const newAnswers = [...state.answers];
      newAnswers[0] = templateText;
      onUpdateProject({ answers: newAnswers });
      alert("התבנית נשמרה! סטודנטים שייכנסו לאפליקציה יראו את תיאור המקרה הזה כברירת מחדל.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-blue-500 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg">👑</div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">מרכז ניהול המרצה</h1>
              <p className="text-slate-500 font-medium">ניהול משימות, בדיקה וגיבוי מערכת</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onBack} className="bg-slate-100 px-8 py-4 rounded-2xl text-slate-600 font-bold border border-slate-200 hover:bg-slate-200 transition-all">חזרה</button>
          </div>
        </header>

        <div className="flex gap-2 mb-8 bg-white/10 p-2 rounded-3xl w-fit mx-auto">
          <button 
            onClick={() => setActiveTab('grading')} 
            className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'grading' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-white/5'}`}
          >
            בדיקת עבודת סטודנט
          </button>
          <button 
            onClick={() => setActiveTab('management')} 
            className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'management' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-white/5'}`}
          >
            ניהול וגיבוי הפרויקט
          </button>
        </div>

        {activeTab === 'grading' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
                <div className="flex flex-col mb-8">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-2">
                    <span className="bg-slate-100 p-2 rounded-xl">📄</span>
                    תשובות הסטודנט: {state.student.fullName || 'לא מזוהה'}
                  </h2>
                  <div className="flex gap-4 mr-12">
                    {state.student.studentId && <span className="text-sm font-bold text-slate-400">ת"ז: {state.student.studentId}</span>}
                    {state.student.email && <span className="text-sm font-bold text-blue-500">מייל: {state.student.email}</span>}
                  </div>
                </div>
                
                <div className="space-y-6 max-h-[600px] overflow-y-auto px-4 custom-scrollbar">
                  {sections.map((sec, i) => (
                    <div key={i} className="p-6 rounded-2xl border-2 bg-slate-50 border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 bg-blue-900 text-white rounded-lg text-[10px] font-black uppercase">{sec.title}</span>
                        <span className="text-[10px] font-black text-slate-400">מקסימום: {sec.max} נק'</span>
                      </div>
                      <p className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">{state.answers[i] || '---'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800 p-8 rounded-[3rem] shadow-xl text-white sticky top-10 border-t-8 border-emerald-500">
                <h3 className="text-2xl font-bold mb-6">📝 ציון ומשוב</h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-400 mb-2">ציון סופי:</label>
                  <input 
                    type="number" 
                    value={finalGrade} 
                    onChange={(e) => setFinalGrade(parseInt(e.target.value))} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-3xl font-black text-emerald-400 outline-none text-center focus:border-emerald-500 transition-all" 
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-400 mb-2">הערות למרצה:</label>
                  <textarea 
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm h-32 outline-none text-right focus:border-blue-500 transition-all" 
                    placeholder="כתבו כאן..."
                  ></textarea>
                </div>
                {!feedbackCode ? (
                  <button onClick={generateFeedback} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black text-xl transition-all shadow-xl">יצירת קוד משוב ✨</button>
                ) : (
                  <div className="bg-white/10 p-4 rounded-2xl border border-emerald-500/30 text-center animate-fade-in">
                    <p className="text-xs font-bold text-emerald-400 mb-2">הקוד מוכן להעתקה:</p>
                    <div className="bg-black/40 p-3 rounded-xl break-all text-[8px] font-mono mb-4 max-h-20 overflow-y-auto select-all">{feedbackCode}</div>
                    <button onClick={() => {navigator.clipboard.writeText(feedbackCode); alert("הקוד הועתק!");}} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm">📋 העתק ושלח לסטודנט</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-2xl font-black mb-6 text-slate-800">🛠️ הגדרת תבנית משימה</h2>
              <p className="text-slate-500 mb-6 font-medium">כאן תוכלי להגדיר סיטואציה קבועה מראש שתוצג לכל הסטודנטים בפתח המשימה.</p>
              <textarea 
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="w-full h-48 p-6 rounded-2xl border-2 border-slate-100 mb-6 outline-none focus:border-blue-500 text-right font-medium"
                placeholder="למשל: תארו מצב של לחץ לקראת מבחן גדול..."
              ></textarea>
              <button onClick={saveTemplate} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">
                שמירת תבנית משימה 💾
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-black mb-6 text-slate-800">📦 גיבוי הפרויקט</h2>
                <p className="text-slate-500 mb-6 font-medium">מומלץ לבצע גיבוי לפני סיום שיחת הצ'אט. הקובץ מכיל את כל המבנה וההגדרות של האפליקציה שלך.</p>
                <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-100 text-amber-800 mb-8">
                  <p className="text-sm font-bold">💡 טיפ למרצה:</p>
                  <p className="text-xs">שמרי את הקובץ במקום בטוח. בשיחה הבאה תוכלי לבקש מה-AI "לטעון" את ההגדרות מהקובץ הזה.</p>
                </div>
              </div>
              <button onClick={exportProjectBackup} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
                <span>📥</span> הורדת גיבוי פרויקט (JSON)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

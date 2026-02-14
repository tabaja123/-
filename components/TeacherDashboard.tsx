
import React from 'react';
import { AppState } from '../types';

interface TeacherDashboardProps {
  state: AppState;
  score: number;
  onBack: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ state, score, onBack }) => {
  const sections = [
    { title: "وصف الحالة (المرحلة 1)", max: 10, step: 1 },
    { title: "تفصيل المشاعر (المرحلة 2)", max: 5, step: 2 },
    { title: "الأفكار (المرحلة 2)", max: 5, step: 2 },
    { title: "الدافع (المرحلة 2)", max: 5, step: 2 },
    { title: "الاحتياجات (المرحلة 2)", max: 5, step: 2 },
    { title: "التنظيم العاطفي (المرحلة 3)", max: 6, step: 3 },
    { title: "الغايات والأهداف (المرحلة 3)", max: 6, step: 3 },
    { title: "الكفاءة الذاتية (المرحلة 3)", max: 6, step: 3 },
    { title: "تحليل الحلقة (المرحلة 4)", max: 6, step: 4 },
    { title: "مراحل التنظيم (المرحلة 4)", max: 6, step: 4 },
    { title: "بنك الأفكار (المرحلة 5)", max: 3, step: 5 },
    { title: "الأداة 1 (المرحلة 5)", max: 3, step: 5 },
    { title: "الأداة 2 (المرحلة 5)", max: 3, step: 5 },
    { title: "الأداة 3 (المرحلة 5)", max: 3, step: 5 },
    { title: "الأداة 4 (المرحلة 5)", max: 3, step: 5 },
    { title: "التعرف المبكر (المرحلة 6)", max: 5, step: 6 },
    { title: "الخطوة الأولى (المرحلة 6)", max: 5, step: 6 },
    { title: "إشباع الاحتياجات (المرحلة 6)", max: 5, step: 6 }
  ];

  const calculateFieldScore = (index: number, content: string): number => {
    if (!content || content.trim().length === 0) return 0;
    const length = content.trim().length;
    const max = sections[index].max;
    
    if (index === 0) return Math.min(max, Math.floor(length / 10)); // Step 1
    if (index >= 1 && index <= 4) return length > 15 ? max : 0; // Step 2 fields
    if (index >= 5 && index <= 9) return length > 20 ? max : 0; // Step 3-4 fields
    if (index >= 10 && index <= 14) return length > 10 ? max : 0; // Step 5 fields
    if (index >= 15) return length > 15 ? max : 0; // Step 6 fields
    return 0;
  };

  // Grouped progress calculation
  const getStepProgress = (stepNumber: number) => {
    const stepFields = sections.filter(s => s.step === stepNumber);
    let earned = 0;
    let max = stepFields.reduce((acc, curr) => acc + curr.max, 0);

    sections.forEach((s, idx) => {
      if (s.step === stepNumber) {
        earned += calculateFieldScore(idx, state.answers[idx]);
      }
    });

    // Special additions
    if (stepNumber === 2) {
      max += 10;
      if (state.emotions.length >= 3) earned += 10;
      else if (state.emotions.length > 0) earned += 5;
    }
    if (stepNumber === 5) {
      max += 5;
      if (state.selectedTools.length > 0) earned += 5;
    }
    if (stepNumber === 6) {
      max += 5;
      if (state.isSubmitted) earned += 5;
    }

    return { earned, max, percent: Math.round((earned / max) * 100) };
  };

  const completionRate = Math.round((state.answers.filter(a => a.trim().length > 0).length / 18) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">تحليل أداء الطالب</h1>
              <p className="text-slate-500 font-medium">{state.student.fullName || 'طالب غير معروف'} | {state.student.studentId || 'بدون رقم هوية'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">النتيجة الإجمالية</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-blue-600">{score}</span>
                <span className="text-xl font-bold text-slate-300">/ 100</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <button 
              onClick={onBack}
              className="bg-slate-100 px-8 py-4 rounded-2xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all font-bold border border-slate-200 shadow-sm"
            >
              العودة للمهمة
            </button>
          </div>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">✅</div>
            <div>
              <div className="text-xs font-bold text-slate-400">نسبة الاكتمال</div>
              <div className="text-2xl font-black text-slate-800">{completionRate}%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center text-xl">❤️</div>
            <div>
              <div className="text-xs font-bold text-slate-400">المشاعر المحددة</div>
              <div className="text-2xl font-black text-slate-800">{state.emotions.length} مشاعر</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">🛠️</div>
            <div>
              <div className="text-xs font-bold text-slate-400">الأدوات المختارة</div>
              <div className="text-2xl font-black text-slate-800">{state.selectedTools.length} أدوات</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl">📬</div>
            <div>
              <div className="text-xs font-bold text-slate-400">حالة الإرسال</div>
              <div className={`text-xl font-black ${state.isSubmitted ? 'text-emerald-600' : 'text-amber-600'}`}>
                {state.isSubmitted ? 'تم الإرسال النهائي' : 'قيد العمل'}
              </div>
            </div>
          </div>
        </div>

        {/* Score Distribution Overview */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-8">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📈</span>
            توزيع الدرجات حسب المراحل
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(step => {
              const progress = getStepProgress(step);
              const stepTitles = [
                "وصف الحدث", "عالمي الداخلي", "السلوك والاستجابة", 
                "التعلم والتحليل", "حقيبة الأدوات", "خطة العمل"
              ];
              const stepColors = [
                "bg-blue-600", "bg-pink-500", "bg-indigo-600",
                "bg-slate-700", "bg-emerald-600", "bg-amber-500"
              ];
              return (
                <div key={step} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-slate-700">المرحلة {step}: {stepTitles[step-1]}</span>
                    <span className="text-sm font-black text-slate-400">{progress.earned} / {progress.max}</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${stepColors[step-1]} transition-all duration-1000 shadow-md`}
                      style={{ width: `${progress.percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Answers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
              <h2 className="text-2xl font-black mb-8 text-slate-800 underline decoration-blue-500 decoration-4 underline-offset-8">تفاصيل الإجابات</h2>
              <div className="space-y-6 max-h-[800px] overflow-y-auto px-4 py-2 custom-scrollbar">
                {state.answers.map((ans, i) => {
                  const fieldScore = calculateFieldScore(i, ans);
                  const isFull = fieldScore === sections[i].max;
                  return (
                    <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${isFull ? 'bg-white border-emerald-100' : ans.trim().length > 0 ? 'bg-white border-amber-50' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{sections[i].title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${fieldScore > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{fieldScore}</span>
                          <span className="text-slate-300 text-xs">/ {sections[i].max}</span>
                        </div>
                      </div>
                      <p className={`text-lg leading-relaxed ${ans.trim().length > 0 ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                        {ans || 'لم يقم الطالب بالإجابة على هذا البند'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Emotions Breakdown */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-pink-600">تحليل المشاعر</h3>
                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-xl text-xs font-black">10 درجات</span>
              </div>
              {state.emotions.length > 0 ? (
                <div className="space-y-4">
                  {state.emotions.map((e, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm font-bold text-slate-600">
                        <span>{e.name}</span>
                        <span>{e.intensity}/10</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-400" style={{ width: `${e.intensity * 10}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 italic text-center py-4">لم يتم اختيار أي مشاعر</p>
              )}
            </div>

            {/* Tools Breakdown */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-indigo-600">الأدوات المفضلة</h3>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-xs font-black">5 درجات</span>
              </div>
              {state.selectedTools.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {state.selectedTools.map((tool, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 shadow-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 italic text-center py-4">لم يتم اختيار أي أدوات</p>
              )}
            </div>

            {/* Teacher Notes Area (Static Mockup) */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="text-xl font-bold mb-4">ملاحظات المعلم الخاصة</h3>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 h-32"
                placeholder="أضف ملاحظاتك التقويمية هنا..."
              ></textarea>
              <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm transition-colors">حفظ الملاحظات</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;


import React, { useState } from 'react';
import { AppState } from '../../types';

interface Step6Props {
  state: AppState;
  answers: string[]; // ans-16, 17, 18
  onAnswerChange: (idx: number, val: string) => void;
  isSubmitted: boolean;
  onUpdate: (updates: any) => void;
  studentName: string;
}

const Step6: React.FC<Step6Props> = ({ state, answers, onAnswerChange, isSubmitted, onUpdate, studentName }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [submissionCode, setSubmissionCode] = useState('');

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = btoa(JSON.stringify(state));
    setSubmissionCode(code);
    onUpdate({ isSubmitted: true });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(submissionCode);
    alert("تم نسخ الكود بنجاح! يرجى إرساله للمحاضر الآن.");
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in py-16 px-12 bg-white rounded-[3.5rem] border-2 border-emerald-100 shadow-2xl max-w-2xl mx-auto w-full text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-inner">
          ✓
        </div>
        <h3 className="text-4xl font-black text-slate-900 mb-6">تم إعداد مهمتك بنجاح!</h3>
        <p className="text-slate-500 text-xl font-light mb-10">
          لقد اكتملت جميع المراحل. للحصول على الدرجة، يجب نسخ "كود التسليم" أدناه وإرساله للمحاضر عبر المنصة التعليمية المخصصة.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border-2 border-dashed border-slate-200">
          <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">كود التسليم الخاص بك:</p>
          <div className="break-all text-[10px] text-slate-600 bg-white p-4 rounded-xl border mb-4 font-mono overflow-y-auto max-h-32">
            {submissionCode}
          </div>
          <button 
            onClick={copyToClipboard}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition"
          >
            📋 نسخ الكود للإرسال
          </button>
        </div>

        <button 
          type="button"
          onClick={() => onUpdate({ isSubmitted: false })}
          className="text-slate-400 font-bold hover:text-slate-600 transition underline underline-offset-4"
        >
          العودة لتعديل الإجابات
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 text-right">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-4 tracking-tight">المرحلة السادسة: خطة عمل للمستقبل</h2>
        <p className="text-slate-400 font-semibold italic">ابنِ خوارزمية النجاح الشخصية الخاصة بك للموقف القادم.</p>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-2xl space-y-10">
        <div className="space-y-8">
          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="ans-16" className="block font-bold text-xl text-slate-800">1. التعرف المبكر والوقاية:</label>
              <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">5 درجات</span>
            </div>
            <textarea
              id="ans-16"
              value={answers[0]}
              onChange={(e) => onAnswerChange(0, e.target.value)}
              className="w-full h-32 p-5 rounded-2xl border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all shadow-inner bg-white text-slate-800"
              placeholder="صف هنا علامات التعرف المبكر..."
            ></textarea>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="ans-17" className="block font-bold text-xl text-slate-800">2. اختيار الأدوات والخطوة الأولى:</label>
              <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">5 درجات</span>
            </div>
            <textarea
              id="ans-17"
              value={answers[1]}
              onChange={(e) => onAnswerChange(1, e.target.value)}
              className="w-full h-32 p-5 rounded-2xl border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all shadow-inner bg-white text-slate-800"
              placeholder="ماذا ستكون خطوتك الأولى؟"
            ></textarea>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="ans-18" className="block font-bold text-xl text-slate-800">3. إشباع الاحتياجات وفحص التقدم:</label>
              <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">5 درجات</span>
            </div>
            <textarea
              id="ans-18"
              value={answers[2]}
              onChange={(e) => onAnswerChange(2, e.target.value)}
              className="w-full h-32 p-5 rounded-2xl border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all shadow-inner bg-white text-slate-800"
              placeholder="كيف ستحافظ على الشعور بالكفاءة؟"
            ></textarea>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-emerald-700 shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
        >
          <span className="group-hover:scale-125 transition-transform">📮</span>
          تجهيز المهمة للتسليم
        </button>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center text-8xl animate-bounce">
          🎉✨🎊
        </div>
      )}
    </div>
  );
};

export default Step6;

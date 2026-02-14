
import React, { useState } from 'react';
import { StudentData } from '../../types';

interface Step1Props {
  data: StudentData;
  answer: string;
  onAnswerChange: (val: string) => void;
  onChange: (data: StudentData) => void;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ data, answer, onAnswerChange, onChange, onNext }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="animate-fade-in space-y-10">
      {/* Help Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 bg-amber-100 text-amber-700 px-6 py-3 rounded-2xl font-bold hover:bg-amber-200 transition shadow-sm border border-amber-200"
        >
          <span>📖</span> تعليمات المهمة (حسب نموذج بينتريتش)
        </button>
      </div>

      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl relative animate-fade-in text-right" dir="rtl">
            <button onClick={() => setShowGuide(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 text-2xl">✖</button>
            <h3 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl">📝</span>
              دليل الطالب للتنظيم الذاتي (بينتريتش)
            </h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>عزيزي الطالب، تعتمد هذه المهمة على نموذج **بول بينتريتش (Pintrich)** الذي يرى التنظيم الذاتي كعملية بناءة ونشطة تمر بـ 4 مراحل أساسية:</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="font-black text-blue-600">1.</span>
                  <span><strong>التخطيط والتمهيد (Planning):</strong> ستبدأ بوصف الحدث وتحديد السياق والأهداف الأولية.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-blue-600">2.</span>
                  <span><strong>المراقبة (Monitoring):</strong> سنقوم بمراقبة "عالمك الداخلي" - مشاعرك وأفكارك ودوافعك أثناء وقوع الحدث.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-blue-600">3.</span>
                  <span><strong>الضبط والتحكم (Control):</strong> ستختار الأدوات والاستراتيجيات المناسبة لتعديل سلوكك ومشاعرك.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-blue-600">4.</span>
                  <span><strong>التقييم ورد الفعل (Reaction/Reflection):</strong> ستحلل النتائج وتبني "خوارزمية" للتعامل مع مواقف مشابهة مستقبلاً.</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full mt-10 bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl"
            >
              فهمت الموديل، لنبدأ!
            </button>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border-r-8 border-amber-400 p-8 rounded-3xl shadow-sm">
        <h3 className="text-amber-900 font-bold text-2xl mb-3 flex items-center gap-3">
          <span>💡</span> ملاحظة أكاديمية:
        </h3>
        <p className="text-amber-800 leading-relaxed text-lg">
          التنظيم الذاتي ليس مجرد "هدوء"، بل هو **إدارة ذكية** للموارد الذهنية والعاطفية. احرص على استخدام لغة وصفية دقيقة في كل مرحلة.
        </p>
      </div>

      <div className="bg-blue-50 p-8 rounded-[2rem] border-r-8 border-blue-600 shadow-sm">
        <h2 className="text-3xl font-black text-blue-900 mb-8 underline decoration-blue-200 underline-offset-8">المرحلة الأولى: التخطيط والتمهيد (وصف الحدث)</h2>
        
        <div className="bg-white/80 p-6 rounded-2xl border-2 border-blue-100 mb-8 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-2 text-blue-900 font-bold text-lg border-b border-blue-100 pb-2">بيانات الطالب/ة:</div>
          <div>
            <label htmlFor="full-name" className="block font-bold text-blue-800 mb-2">الاسم الكامل:</label>
            <input
              id="full-name"
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ ...data, fullName: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-blue-50 focus:border-blue-400 outline-none transition shadow-sm bg-white"
              placeholder="أدخل اسمك الكامل..."
            />
          </div>
          <div>
            <label htmlFor="student-id" className="block font-bold text-blue-800 mb-2">رقم الهوية:</label>
            <input
              id="student-id"
              type="text"
              value={data.studentId}
              onChange={(e) => onChange({ ...data, studentId: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-blue-50 focus:border-blue-400 outline-none transition shadow-sm bg-white"
              placeholder="9 أرقام..."
            />
          </div>
        </div>

        <div className="flex justify-between items-end mb-3">
          <p className="text-blue-900 font-bold text-lg">وصف الحالة والسياق:</p>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md">10 درجات</span>
        </div>
        <p className="text-blue-800 leading-relaxed italic text-base mb-6">
          حدد الحدث، الوقت، المكان، والأهداف التي كانت لديك في ذلك الوقت. وفقاً لبينتريتش، هذه هي مرحلة **التنشيط المعرفي**.
        </p>
        
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-full p-5 rounded-2xl border-2 border-blue-100 focus:border-blue-400 outline-none transition-all min-h-[150px] shadow-inner text-slate-800"
          placeholder="اكتب هنا تفاصيل الحدث..."
        ></textarea>
      </div>
    </div>
  );
};

export default Step1;

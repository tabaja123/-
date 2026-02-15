
import React, { useState } from 'react';
import { AppState, Language } from '../../types';
import { translations } from '../../locales';

interface Step6Props {
  state: AppState;
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  isSubmitted: boolean;
  onUpdate: (updates: any) => void;
  studentName: string;
  language: Language;
}

const Step6: React.FC<Step6Props> = ({ state, answers, onAnswerChange, isSubmitted, onUpdate, studentName, language }) => {
  const [submissionCode, setSubmissionCode] = useState('');
  const t = translations[language] as any;

  const generateSubmissionCode = () => {
    try {
      // קידוד בטוח ל-UTF-8 עבור עברית וערבית
      const dataStr = JSON.stringify(state);
      const code = btoa(encodeURIComponent(dataStr).replace(/%([0-9A-F]{2})/g, (match, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ));
      setSubmissionCode(code);
      return code;
    } catch (e) {
      return "Error generating code";
    }
  };

  const handleFinish = () => {
    if (!state.student.fullName || state.student.fullName.trim().length < 2) {
      alert(language === 'he' ? 'אנא חזור לשלב 1 והשלם את שמך המלא' : 'يرجى العودة للمرحلة 1 وإكمال اسمك الكامل');
      return;
    }
    generateSubmissionCode();
    onUpdate({ isSubmitted: true });
  };

  if (isSubmitted) {
    const code = submissionCode || generateSubmissionCode();
    return (
      <div className="animate-fade-in py-12 px-6 bg-white rounded-[4rem] border-4 border-blue-100 shadow-2xl max-w-2xl mx-auto w-full text-center" dir="rtl">
        <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl font-bold shadow-xl rotate-3">✓</div>
        <h3 className="text-4xl font-black text-slate-900 mb-4">{t.successCode}</h3>
        <p className="text-slate-500 text-lg mb-10 font-medium">
          {language === 'he' 
            ? 'סיימת את המטלה בהצלחה! העתק את הקוד למטה ושלח אותו למרצה.' 
            : 'لقد أكملت المهمة بنجاح! انسخ الكود أدناه وأرسله إلى المحاضر.'}
        </p>
        
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-dashed border-slate-200 relative">
          <div className="absolute -top-4 right-8 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Submission Token
          </div>
          <div className="break-all text-[10px] bg-white p-6 rounded-2xl border mb-6 font-mono max-h-40 overflow-y-auto text-left leading-tight text-slate-400 select-all shadow-inner" dir="ltr">
            {code}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(code);
              alert(language === 'he' ? "הקוד הועתק למקלדת!" : "تم نسخ الكود!");
            }} 
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <span>📋</span> {t.copyCode}
          </button>
        </div>
        
        <p className="mt-8 text-slate-400 text-sm font-bold">
          {language === 'he' ? 'שימי לב: ללא שליחת הקוד למרצה, העבודה לא תיבדק.' : 'انتبه: بدون إرسال الكود للمحاضر، لن يتم فحص العمل.'}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <header className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl border-b-8 border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl bg-white/10 p-6 rounded-3xl shrink-0">🚩</div>
          <div>
            <h2 className="text-4xl font-black mb-3">{t.step6_name}</h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">{t.step6_instr}</p>
          </div>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl space-y-8">
        {[
          { label: t.label_warning, idx: 0 },
          { label: t.label_firstStep, idx: 1 },
          { label: t.label_maintenance, idx: 2 },
          { label: t.label_doDifferently, idx: 3 }
        ].map((field) => (
          <div key={field.idx} className="space-y-4">
            <label className="block font-black text-xl text-slate-800">{field.label}</label>
            <textarea 
              value={answers[field.idx] || ''} 
              onChange={(e) => onAnswerChange(field.idx, e.target.value)} 
              className="w-full h-32 p-6 rounded-[1.5rem] outline-none text-right bg-slate-50 border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" 
              placeholder={t.placeholder_step6}
            ></textarea>
          </div>
        ))}

        <div className="pt-8 border-t-2 border-slate-50">
          <button 
            onClick={handleFinish} 
            className="w-full py-10 rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-5"
          >
            <span className="text-4xl">📮</span>
            <span>{t.finishBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;

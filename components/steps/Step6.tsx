
import React, { useState, useEffect } from 'react';
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
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const t = translations[language] as any;

  // הזיני כאן את ה-URL שלך אחרי ה-Deployment בגוגל
  const GOOGLE_SHEET_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

  const generateBackupCode = () => {
    try {
      const dataStr = JSON.stringify(state);
      const code = btoa(encodeURIComponent(dataStr).replace(/%([0-9A-F]{2})/g, (match, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ));
      setSubmissionCode(code);
    } catch (e) {
      setSubmissionCode("Error generating code");
    }
  };

  const handleSubmit = async () => {
    // בדיקה ששם הסטודנט קיים (מניעת הגשות אנונימיות)
    if (!state.student.fullName || state.student.fullName.length < 2) {
      alert(language === 'he' ? 'אנא חזור לשלב 1 ומלא שם מלא' : 'يرجى العودة للمرحلة 1 وكتابة الاسم الكامل');
      return;
    }

    setIsSending(true);
    setStatus('sending');
    generateBackupCode();

    try {
      if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.startsWith('http')) {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            ...state
          })
        });
        setStatus('success');
      } else {
        // אם אין URL, אנחנו מדלגים ישר להצלחה מקומית (קוד גיבוי)
        setStatus('success');
      }
      onUpdate({ isSubmitted: true });
    } catch (error) {
      console.error("Submission error", error);
      setStatus('error');
      // גם אם יש שגיאה ברשת, אנחנו מאפשרים לסטודנט לסיים עם קוד הגיבוי
      onUpdate({ isSubmitted: true });
    } finally {
      setIsSending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in py-12 px-6 bg-white rounded-[3rem] border-4 border-emerald-100 shadow-2xl max-w-2xl mx-auto w-full text-center" dir="rtl">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">✓</div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">{t.successCode}</h3>
        <p className="text-slate-500 mb-8 font-medium">
          {language === 'he' ? 'המטלה נשמרה בהצלחה במערכת.' : 'تم حفظ المهمة بنجاح في النظام.'}
        </p>

        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            {language === 'he' ? 'קוד הגשה ידני (לגיבוי)' : 'كود التسليم اليدوي (للاحتياط)'}
          </p>
          <div className="bg-white p-4 rounded-xl border text-[10px] font-mono break-all mb-4 max-h-32 overflow-y-auto text-left leading-tight text-slate-400 select-all" dir="ltr">
            {submissionCode}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(submissionCode);
              alert(language === 'he' ? "הקוד הועתק!" : "تم نسخ الكود!");
            }}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <span>📋</span> {t.copyCode}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 text-right">
      <header className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="text-5xl">🚀</div>
          <div>
            <h2 className="text-3xl font-black mb-1">{t.step6_name}</h2>
            <p className="text-slate-400 font-medium">{t.step6_instr}</p>
          </div>
        </div>
      </header>

      {/* מדריך ויזואלי לסטודנט */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: '🕒', title: t.timing_before_title, desc: t.timing_before_desc, color: 'bg-blue-50 text-blue-700' },
          { icon: '🔥', title: t.timing_during_title, desc: t.timing_during_desc, color: 'bg-orange-50 text-orange-700' },
          { icon: '📖', title: t.timing_after_title, desc: t.timing_after_desc, color: 'bg-emerald-50 text-emerald-700' }
        ].map((item, i) => (
          <div key={i} className={`${item.color} p-6 rounded-[2rem] border-2 border-white shadow-sm`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <h4 className="font-black mb-1">{item.title}</h4>
            <p className="text-[10px] leading-relaxed opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-lg space-y-8">
        {[
          { label: t.label_warning, idx: 0 },
          { label: t.label_firstStep, idx: 1 },
          { label: t.label_maintenance, idx: 2 },
          { label: t.label_doDifferently, idx: 3 }
        ].map((field) => (
          <div key={field.idx} className="space-y-3">
            <label className="block font-black text-slate-700 text-lg flex justify-between items-center">
              <span>{field.label}</span>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-400">5 נק'</span>
            </label>
            <textarea 
              value={answers[field.idx] || ''} 
              onChange={(e) => onAnswerChange(field.idx, e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 bg-slate-50/30 transition-all min-h-[100px]"
              placeholder={t.placeholder_step6}
            />
          </div>
        ))}

        <div className="pt-4">
          <button 
            onClick={handleSubmit}
            disabled={isSending}
            className={`w-full py-8 rounded-[2rem] font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
              isSending ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSending ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><span>📮</span> {t.finishBtn}</>
            )}
          </button>
          
          {status === 'error' && (
            <p className="text-red-500 text-center mt-4 text-xs font-bold">
              {language === 'he' ? 'שגיאת רשת - אל דאגה, קוד הגיבוי ייווצר כעת' : 'خطأ في الشبكة - لا تقلق، سيتم إنشاء كود النسخ الاحتياطي الآن'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step6;

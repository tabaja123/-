
import React, { useState } from 'react';
import { Language } from '../../types';
import { translations } from '../../locales';

interface Step34Props {
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  isStep4: boolean;
  language: Language;
}

const Step34: React.FC<Step34Props> = ({ answers, onAnswerChange, isStep4, language }) => {
  const [isResponseBankOpen, setIsResponseBankOpen] = useState(false);
  const t = translations[language];

  const regulatedExamples = [t.resp_reg_1, t.resp_reg_2, t.resp_reg_3, t.resp_reg_4];
  const impulsiveExamples = [t.resp_imp_1, t.resp_imp_2, t.resp_imp_3, t.resp_imp_4];

  const addToResponse = (text: string) => {
    const current = answers[0] || '';
    const updated = current.length > 0 ? `${current}, ${text}` : text;
    onAnswerChange(0, updated);
  };

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <header className={`rounded-[3rem] p-10 text-white shadow-xl border-b-8 ${isStep4 ? 'bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-900/30' : 'bg-gradient-to-br from-blue-700 to-indigo-800 border-blue-900/30'}`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl bg-white/10 p-6 rounded-3xl shrink-0">{isStep4 ? '📊' : '⚙️'}</div>
          <div>
            <h2 className="text-4xl font-black mb-3">{isStep4 ? t.step4_name : t.step3_name}</h2>
            <p className="text-blue-50 text-xl leading-relaxed max-w-2xl">{isStep4 ? t.step4_instr : t.step3_instr}</p>
          </div>
        </div>
      </header>

      {!isStep4 ? (
        <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h4 className="text-2xl font-black text-slate-800">{t.responseBankTitle}:</h4>
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <button onClick={() => setIsResponseBankOpen(!isResponseBankOpen)} className="bg-blue-50 text-blue-700 px-8 py-3 rounded-2xl font-black border-2 border-blue-100 hover:bg-blue-100 transition-all">
              {isResponseBankOpen ? t.close : t.open_bank}
            </button>
          </div>
          {isResponseBankOpen && (
            <div className="grid md:grid-cols-2 gap-8 mb-10 animate-fade-in">
              <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border-2 border-emerald-100">
                <h5 className="font-black text-emerald-800 mb-4 flex items-center gap-2">🌱 {t.resp_regulated_title}</h5>
                <div className="space-y-3">
                  {regulatedExamples.map((ex, i) => (
                    <button key={i} onClick={() => addToResponse(ex)} className="w-full text-right p-3 bg-white border-2 border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">+ {ex}</button>
                  ))}
                </div>
              </div>
              <div className="bg-rose-50/50 p-6 rounded-[2.5rem] border-2 border-rose-100">
                <h5 className="font-black text-rose-800 mb-4 flex items-center gap-2">⚡ {t.resp_impulsive_title}</h5>
                <div className="space-y-3">
                  {impulsiveExamples.map((ex, i) => (
                    <button key={i} onClick={() => addToResponse(ex)} className="w-full text-right p-3 bg-white border-2 border-rose-200 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-sm">+ {ex}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_response}</label>
          <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-[2rem] border-2 outline-none text-right focus:border-blue-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
        </section>
      ) : (
        <div className="space-y-12">
          <section className="bg-white p-12 rounded-[3.5rem] border-4 border-slate-50 shadow-2xl flex flex-col items-center">
             <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_efficacy}</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-400 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_performance}</div>
                <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_achievements}</div>
                <div className="absolute inset-10 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500 fill-current opacity-80"><path d="M 50,10 A 40,40 0 1,1 10,50" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" /><polygon points="10,50 0,40 20,40" /></svg>
                </div>
             </div>
             <p className="mt-12 text-center text-slate-600 font-bold max-w-lg mx-auto leading-relaxed text-lg">
                {(language === 'ar' ? 'تفاعل هذه العناصر يخلق حلقة تغذية راجعة تقوي مهارات التنظيم الذاتي لديك.' : 'הקשר בין המרכיבים הללו יוצר לולאת משוב שמחזקת את יכולת הוויסות העצמי שלך.')}
             </p>
          </section>

          <div className="bg-white p-10 rounded-[3rem] border-r-8 border-emerald-500 shadow-xl space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block font-black text-slate-800 text-xl">{t.label_evaluation}</label>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-black">7 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
              </div>
              <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-[2rem] border-2 outline-none text-right focus:border-emerald-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
            </div>
            <div className="pt-8 border-t-2 border-slate-50">
              <div className="flex justify-between items-center mb-4">
                <label className="block font-black text-slate-800 text-xl">{(t as any).label_efficacy_analysis}</label>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black">8 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
              </div>
              <textarea value={answers[2]} onChange={(e) => onAnswerChange(2, e.target.value)} className="w-full h-44 p-6 rounded-[2rem] border-2 outline-none text-right focus:border-blue-500 shadow-inner bg-blue-50/30" placeholder={t.describeCase}></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step34;

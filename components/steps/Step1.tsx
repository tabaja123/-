
import React from 'react';
import { StudentData, Language } from '../../types';
import { translations } from '../../locales';

interface Step1Props {
  data: StudentData;
  answer: string;
  onAnswerChange: (val: string) => void;
  onChange: (data: StudentData) => void;
  onNext: () => void;
  language: Language;
}

const Step1: React.FC<Step1Props> = ({ data, answer, onAnswerChange, onChange, onNext, language }) => {
  const t = translations[language] as any;

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <header className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[3rem] p-10 text-white shadow-xl border-b-8 border-blue-900/30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl bg-white/10 p-6 rounded-3xl shrink-0">📝</div>
          <div>
            <h2 className="text-4xl font-black mb-3">{t.step1_name}</h2>
            <p className="text-blue-100 text-xl leading-relaxed max-w-2xl">{t.step1_instr}</p>
          </div>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
        <h2 className="text-3xl font-black text-slate-800 mb-8">{t.studentDataTitle}</h2>
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.fullName}:</label>
            <input type="text" value={data.fullName || ''} onChange={(e) => onChange({ ...data, fullName: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right focus:border-blue-500 bg-white" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.studentId}:</label>
            <input type="text" value={data.studentId || ''} onChange={(e) => onChange({ ...data, studentId: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right focus:border-blue-500 bg-white" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.email}:</label>
            <input type="email" value={data.email || ''} onChange={(e) => onChange({ ...data, email: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right placeholder:text-slate-300 focus:border-blue-500 bg-white" placeholder="example@email.com" />
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="block font-black text-slate-700 text-xl">{language === 'ar' ? 'وصف الموقف:' : 'תיאור המקרה:'}</label>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
        </div>
        <textarea value={answer || ''} onChange={(e) => onAnswerChange(e.target.value)} className="w-full p-8 rounded-[2.5rem] border-2 min-h-[250px] outline-none text-right focus:border-blue-500 bg-white shadow-inner leading-relaxed" placeholder={t.describeCase}></textarea>
      </div>
    </div>
  );
};

export default Step1;

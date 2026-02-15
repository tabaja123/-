
import React, { useState } from 'react';
import { EMOTIONS } from '../../constants';
import { EmotionSelection, Language } from '../../types';
import { translations } from '../../locales';

interface Step2Props {
  emotions: EmotionSelection[];
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  onUpdate: (updates: any) => void;
  language: Language;
}

const Step2: React.FC<Step2Props> = ({ emotions, answers, onAnswerChange, onUpdate, language }) => {
  const [isEmotionBankOpen, setIsEmotionBankOpen] = useState(false);
  const [isThoughtBankOpen, setIsThoughtBankOpen] = useState(false);
  const [isNeedsBankOpen, setIsNeedsBankOpen] = useState(false);
  const t = translations[language] as any;

  const toggleEmotion = (emotion: { id: string, name: string }) => {
    const exists = emotions.find(e => e.id === emotion.id);
    if (exists) onUpdate({ emotions: emotions.filter(e => e.id !== emotion.id) });
    else onUpdate({ emotions: [...emotions, { ...emotion, intensity: 5 }] });
  };

  const getEmotionName = (emo: any) => {
    if (language === 'ar') return emo.name;
    const heMap: Record<string, string> = {
      'فرح': 'שמחה', 'غضب': 'כעס', 'حزن': 'עצב', 'خوف': 'פחד', 'احباط': 'תסכול',
      'خجل': 'בושה', 'رفض': 'דחייה', 'ازدراء': 'בוז', 'حماس': 'התלהבות', 'راحة': 'רוגע',
      'فخر': 'גאווה', 'ذنب': 'אשמה', 'חסד': 'קנאה', 'ملل': 'שעמום', 'ارتباك': 'בלבול',
      'وحدة': 'בדידות', 'دهشة': 'הפתעה', 'قلق': 'חרדה', 'رضا': 'שביעות רצון', 'تعب': 'עייפות',
      'عجز': 'חוסר אונים', 'أمل': 'תקווה', 'נדמ': 'חרטה', 'فضول': 'סקרנות'
    };
    return heMap[emo.name] || emo.name;
  };

  const autoThoughts = [t.auto_thought_1, t.auto_thought_2, t.auto_thought_3, t.auto_thought_4, t.auto_thought_5];
  const needs = [
    { title: t.need_autonomy_title, desc: t.need_autonomy_desc, icon: '🔓' },
    { title: t.need_competence_title, desc: t.need_competence_desc, icon: '🏆' },
    { title: t.need_relatedness_title, desc: t.need_relatedness_desc, icon: '🤝' }
  ];

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <header className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[3rem] p-10 text-white shadow-xl border-b-8 border-indigo-900/30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl bg-white/10 p-6 rounded-3xl shrink-0">🔍</div>
          <div>
            <h2 className="text-4xl font-black mb-3">{t.step2_name}</h2>
            <p className="text-indigo-100 text-xl leading-relaxed max-w-2xl">{t.step2_instr}</p>
          </div>
        </div>
      </header>

      {/* Emotion Bank */}
      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.emotionBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsEmotionBankOpen(!isEmotionBankOpen)} className="bg-pink-50 text-pink-700 px-8 py-3 rounded-2xl font-black border-2 border-pink-100 hover:bg-pink-100 transition-all">
            {isEmotionBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isEmotionBankOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-10 p-8 bg-pink-50/20 rounded-[2.5rem] animate-fade-in border-2 border-pink-100/50">
            {EMOTIONS.map((emo) => (
              <button key={emo.id} onClick={() => toggleEmotion(emo)} className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${emotions.some(e => e.id === emo.id) ? 'border-pink-600 bg-pink-50 scale-105 shadow-md' : 'bg-white border-transparent shadow-sm hover:border-pink-200'}`}>
                <img src={emo.imageUrl} alt={emo.name} className="w-full h-16 rounded-xl object-cover" />
                <span className="text-[10px] font-black">{getEmotionName(emo)}</span>
              </button>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_feelings}</label>
        <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-32 p-6 border-2 outline-none rounded-[2rem] text-right focus:border-blue-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
      </section>

      {/* Thought Bank */}
      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.thoughtBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)} className="bg-blue-50 text-blue-700 px-8 py-3 rounded-2xl font-black border-2 border-blue-100 hover:bg-blue-100 transition-all">
            {isThoughtBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isThoughtBankOpen && (
          <div className="flex flex-wrap gap-3 mb-10 p-8 bg-blue-50/20 rounded-[2.5rem] animate-fade-in border-2 border-blue-100/50">
            {autoThoughts.map((thought, i) => (
              <button key={i} onClick={() => onAnswerChange(1, (answers[1] ? answers[1] + ', ' : '') + thought)} className="bg-white border-2 border-blue-200 px-4 py-2 rounded-xl text-sm font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                {thought}
              </button>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_thoughts}</label>
        <textarea value={answers[1]} onChange={(e) => onAnswerChange(1, e.target.value)} className="w-full h-32 p-6 border-2 outline-none rounded-[2rem] text-right focus:border-blue-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
      </section>

      {/* Needs Bank */}
      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.needsBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsNeedsBankOpen(!isNeedsBankOpen)} className="bg-teal-50 text-teal-700 px-8 py-3 rounded-2xl font-black border-2 border-teal-100 hover:bg-teal-100 transition-all">
            {isNeedsBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isNeedsBankOpen && (
          <div className="grid md:grid-cols-3 gap-6 mb-10 p-8 bg-teal-50/20 rounded-[2.5rem] animate-fade-in border-2 border-teal-100/50">
            {needs.map((need, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-xl flex flex-col items-center text-center group transition-all hover:scale-105">
                <span className="text-5xl mb-4">{need.icon}</span>
                <span className="text-teal-900 font-black text-xl mb-3">{need.title}</span>
                <p className="text-xs text-slate-600 font-bold mb-4">{need.desc}</p>
                <button onClick={() => onAnswerChange(2, (answers[2] ? answers[2] + ', ' : '') + need.title)} className="mt-auto bg-teal-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-teal-700 shadow-lg w-full transition-all active:scale-95">
                  {language === 'ar' ? 'اختيار' : 'בחר'}
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_needs}</label>
        <textarea value={answers[2]} onChange={(e) => onAnswerChange(2, e.target.value)} className="w-full h-32 p-6 border-2 outline-none rounded-[2rem] text-right focus:border-blue-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
      </section>
    </div>
  );
};

export default Step2;

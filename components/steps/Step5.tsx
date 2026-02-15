
import React, { useState } from 'react';
import { ThoughtPair, Language } from '../../types';
import { translations } from '../../locales';

interface Step5Props {
  reframing: ThoughtPair[];
  selectedTools: string[];
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  onUpdate: (updates: any) => void;
  language: Language;
}

const TOOL_ICONS: Record<string, string> = {
  'التنفس العميق': '🌬️', 'نموذج أفرات (EFRAT)': '🔄', 'الحديث الذاتي المشجع': '🗣️',
  'اليقظة الذهنية (Mindfulness)': '🧘', 'تقنيات التثبيت (5-4-3-2-1)': '⚓',
  'تقنية بومودورو': '🍅', 'مصفوفة آيزنهاور': '⊞', 'الجدول الزمني الرقمي': '📅',
  'تجزئة المهام (Chunking)': '🧱', 'تحديد الأولويات': '🎯', 'تحديد أهداف SMART': '🎯',
  'الاتصال بالقيم الجוهرية': '💎', 'تحليل الربح والخסارة': '⚖️', 'تخيل النجاح': '🌈',
  'وضع الحدود': '🚧', 'ورقة متابعة الأداء': '📝', 'التأمل اليومي': '🕯️',
  'استراتيجية التغذية الذاتية': '🍎', 'طلب التغذية الراجعة': '💬', 'استخلاص الدروس': '📖',
  'נשימות עמוקות': '🌬️', 'מודל אפר"ת': '🔄', 'דיבור עצמי מעודד': '🗣️',
  'מיינדפולנס': '🧘', 'טכניקות קרקוע': '⚓', 'שיטת פומודורו': '🍅',
  'מטריצת אייזנהאור': '⊞', 'לו"ז דיגיטלי': '📅', 'פירוק משימות': '🧱',
  'תיעדוף משימות': '🎯', 'יעדי SMART': '🎯', 'חיבור לערכים': '💎',
  'ניתוח רווח והפסד': '⚖️', 'דמיון מודרך להצלחה': '🌈', 'הצבת גבולות': '🚧',
  'דף מעקב ביצועים': '📝', 'רפלקציה יומית': '🕯️', 'הזנה עצמית': '🍎',
  'בקשת משוב': '💬', 'הפקת לקחים': '📖'
};

const Step5: React.FC<Step5Props> = ({ selectedTools, answers, onAnswerChange, onUpdate, language }) => {
  const [isThoughtBankOpen, setIsThoughtBankOpen] = useState(false);
  const [isStylesBankOpen, setIsStylesBankOpen] = useState(false);
  const t = translations[language] as any;

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) onUpdate({ selectedTools: selectedTools.filter(t => t !== tool) });
    else onUpdate({ selectedTools: [...selectedTools, tool] });
  };

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <header className="bg-gradient-to-br from-teal-700 to-emerald-900 rounded-[3rem] p-10 text-white shadow-xl border-b-8 border-teal-950/30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl bg-white/10 p-6 rounded-3xl shrink-0">🧱</div>
          <div>
            <h2 className="text-4xl font-black mb-3">{t.step5_name}</h2>
            <p className="text-emerald-50 text-xl leading-relaxed max-w-2xl">{t.step5_instr}</p>
          </div>
        </div>
      </header>

      <section className="bg-amber-50 p-10 rounded-[3rem] border-4 border-amber-100 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-amber-900">🧠 1. {t.reframingTitle}</h3>
            <span className="bg-amber-200 text-amber-800 px-4 py-1 rounded-full text-sm font-black">4 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsStylesBankOpen(!isStylesBankOpen)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg text-sm hover:bg-blue-700 transition-all">{isStylesBankOpen ? t.close : t.thinkingStylesBank}</button>
            <button onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)} className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg text-sm hover:bg-amber-700 transition-all">{isThoughtBankOpen ? t.close : (language === 'ar' ? 'أمثلة' : 'דוגמאות')}</button>
          </div>
        </div>
        {isThoughtBankOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.thought_pairs.map((pair: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="bg-white p-5 rounded-2xl border-2 border-red-50 font-bold text-red-600 shadow-sm">❌ {pair.original}</div>
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-50 font-bold text-emerald-600 shadow-sm">✅ {pair.alternative}</div>
              </React.Fragment>
            ))}
          </div>
        )}
        <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-[2rem] border-2 outline-none text-right shadow-inner bg-white/50 font-medium focus:border-amber-400 leading-relaxed" placeholder={t.placeholder_step5}></textarea>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {t.tool_banks.map((bank: any, bIdx: number) => (
          <div key={bIdx} className="p-10 rounded-[3.5rem] bg-white border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-6 border-b-4 border-blue-50 pb-2">
              <h4 className="font-black text-slate-800 text-xl">{bank.title}</h4>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">4 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {bank.tools.map((tool: string, tIdx: number) => (
                <button key={tIdx} onClick={() => toggleTool(tool)} className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${selectedTools.includes(tool) ? 'bg-slate-800 text-white scale-105 shadow-xl' : 'bg-slate-50 border-2 border-slate-100 hover:bg-slate-100'}`}><span className="text-xl">{TOOL_ICONS[tool] || '🔧'}</span><span>{tool}</span></button>
              ))}
            </div>
            <textarea value={answers[bIdx + 1]} onChange={(e) => onAnswerChange(bIdx + 1, e.target.value)} className="w-full h-40 p-6 rounded-2xl outline-none bg-slate-50/50 border-2 text-right shadow-inner focus:border-blue-500 leading-relaxed" placeholder={t.placeholder_step5}></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step5;

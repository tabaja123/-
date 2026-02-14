
import React, { useState } from 'react';
import { ThoughtPair } from '../../types';
import { TOOL_BANKS } from '../../constants';

interface Step5Props {
  reframing: ThoughtPair[];
  selectedTools: string[];
  answers: string[]; // ans-11, 12, 13, 14, 15
  onAnswerChange: (idx: number, val: string) => void;
  onUpdate: (updates: any) => void;
}

const TOOL_ICONS: Record<string, string> = {
  'التنفس العميق': '🌬️',
  'نموذج أفرات (EFRAT)': '🔄',
  'الحديث الذاتي المشجع': '🗣️',
  'اليقظة الذهنية (Mindfulness)': '🧘',
  'تقنيات التثبيت (5-4-3-2-1)': '⚓',
  'تقنية بومودورو': '🍅',
  'مصفوفة آيزنهاور': '⊞',
  'الجدول الزمني الرقمي': '📅',
  'تجزئة المهام (Chunking)': '🧱',
  'تحديد الأولويات': '🎯',
  'تحديد أهداف SMART': '📏',
  'الاتصال بالقيم الجوهرية': '💎',
  'تحليل الربح والخسارة': '⚖️',
  'تخيل النجاح': '🌈',
  'وضع الحدود': '🚧',
  'ورقة متابعة الأداء': '📈',
  'التأمل اليومي': '🧘‍♂️',
  'استراتيجية التغذية الذاتية': '🔋',
  'طلب التغذية الراجعة': '📨',
  'استخلاص الدروس': '🧠'
};

const Step5: React.FC<Step5Props> = ({ reframing, selectedTools, answers, onAnswerChange, onUpdate }) => {
  const [isThoughtBankOpen, setIsThoughtBankOpen] = useState(false);

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      onUpdate({ selectedTools: selectedTools.filter(t => t !== tool) });
    } else {
      onUpdate({ selectedTools: [...selectedTools, tool] });
    }
  };

  const getToolIcon = (tool: string) => TOOL_ICONS[tool] || '🔧';

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-10 rounded-[2.5rem] text-white shadow-xl">
        <h2 className="text-3xl font-black">المرحلة الخامسة: حقيبة الأدوات للطالب المنظم ذاتياً</h2>
        <p className="opacity-80 italic mt-2">اختيار أدوات عملية وتصميم أفكار محفزة.</p>
      </div>

      <section className="bg-amber-50 p-8 rounded-[3rem] border-2 border-amber-200 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-amber-900 flex items-center gap-2">
              <span>🧠</span> 1. بنك الأفكار: التحويل للتنظيم (10 أزواج)
            </h3>
            <span className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">3 درجات</span>
          </div>
          <button 
            onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)}
            className="bg-amber-600 text-white px-6 py-2 rounded-2xl font-bold shadow-md hover:bg-amber-700 transition"
          >
            {isThoughtBankOpen ? 'إخفاء الأمثلة' : 'عرض الأمثلة الكاملة'}
          </button>
        </div>

        {isThoughtBankOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in text-sm leading-relaxed">
            {reframing.map((pair, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm">
                  <span className="text-red-600 font-bold block mb-1">❌ "{pair.original}"</span>
                  <span className="text-slate-500 italic">فكرة تلقائية/مشحونة</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-emerald-600 font-bold block mb-1">✅ "{pair.alternative}"</span>
                  <span className="text-slate-500 italic">فكرة منظمة/محفزة</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-amber-800 font-semibold bg-white/50 p-4 rounded-xl border border-amber-100">
            استخدم الأمثلة أعلاه وقم بتحويل الأفكار الشخصية التي راودتك في الحدث إلى أفكار منظمة ومحفزة:
          </p>
          <textarea
            value={answers[0]}
            onChange={(e) => onAnswerChange(0, e.target.value)}
            className="w-full h-40 p-5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 outline-none transition-all shadow-inner bg-white text-slate-800"
            placeholder="قم بتحويل أفكارك هنا بالتفصيل..."
          ></textarea>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 px-4 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg">🛠️</span>
            2. اختيار أدوات من البنوك الأربعة
          </h3>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">5 درجات للاختيار</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TOOL_BANKS.map((bank, bIdx) => (
            <div key={bIdx} className={`p-8 rounded-[2.5rem] border-2 shadow-md transition-all ${
              bIdx === 0 ? 'bg-blue-50 border-blue-100' : 
              bIdx === 1 ? 'bg-indigo-50 border-indigo-100' :
              bIdx === 2 ? 'bg-emerald-50 border-emerald-100' :
              'bg-purple-50 border-purple-100'
            }`}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-xl">{bank.title}</h4>
                <span className="bg-slate-800 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm shrink-0">3 درجات</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {bank.tools.map((tool, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => toggleTool(tool)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      selectedTools.includes(tool)
                        ? 'bg-slate-800 text-white shadow-lg scale-105'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-lg">{getToolIcon(tool)}</span>
                    {tool}
                  </button>
                ))}
              </div>
              <textarea
                value={answers[bIdx + 1]}
                onChange={(e) => onAnswerChange(bIdx + 1, e.target.value)}
                className="w-full h-32 p-4 rounded-xl border-none shadow-inner focus:ring-2 focus:ring-indigo-300 outline-none bg-white/50"
                placeholder={`تفصيل استخدام الأدوات من فئة ${bank.title.split(' (')[0]}...`}
              ></textarea>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Step5;

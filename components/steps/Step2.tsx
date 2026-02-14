
import React, { useState } from 'react';
import { EMOTIONS } from '../../constants';
import { EmotionSelection } from '../../types';

interface Step2Props {
  emotions: EmotionSelection[];
  answers: string[]; // ans-2, ans-3, ans-4, ans-5
  onAnswerChange: (idx: number, val: string) => void;
  onUpdate: (updates: any) => void;
}

const IDENTIFICATION_THOUGHTS = [
  "أنا ببساطة لست جيداً بما يكفي في هذا",
  "لا فرصة لدي للالتزام بالجدول الزمني",
  "الجميع من حولي يبدون وكأن كل شيء سهل بالنسبة لهم",
  "إذا فشلت في هذا امتحان، سيضيع اللقب كله",
  "من المؤكد أن هذا المحاضر يكرهني",
  "لماذا تقع هذه المهام دائماً على عاتقي؟",
  "لا أحد يفهم حقاً مدى صعوبة الأمر بالنسبة لي",
  "يجب أن أفعل ذلك بشكل مثالي أو لا أفعله على الإطلاق",
  "هذا ببساطة أكبر مني، أنا لا أنتمي لهنا",
  "أنا فقط أضيع وقتي"
];

const Step2: React.FC<Step2Props> = ({ emotions, answers, onAnswerChange, onUpdate }) => {
  const [isEmotionBankOpen, setIsEmotionBankOpen] = useState(false);
  const [isThoughtBankOpen, setIsThoughtBankOpen] = useState(false);

  const toggleEmotion = (emotion: { id: string, name: string }) => {
    const exists = emotions.find(e => e.id === emotion.id);
    if (exists) {
      onUpdate({ emotions: emotions.filter(e => e.id !== emotion.id) });
    } else {
      onUpdate({ emotions: [...emotions, { ...emotion, intensity: 5 }] });
    }
  };

  const updateIntensity = (id: string, intensity: number) => {
    onUpdate({
      emotions: emotions.map(e => e.id === id ? { ...e, intensity } : e)
    });
  };

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <div className="bg-indigo-50 p-8 rounded-[2rem] border-r-8 border-indigo-600 shadow-sm">
        <h2 className="text-3xl font-black text-indigo-900 mb-2 underline decoration-indigo-200 underline-offset-8">المرحلة الثانية: عالمي الداخلي أثناء الحدث</h2>
        <p className="text-indigo-800 text-lg italic font-semibold">تحديد العواطف، الأفكار، الدافع والاحتياجات النفسية.</p>
      </div>

      {/* Emotion Selection Section */}
      <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <label className="text-xl font-bold text-slate-700 flex items-center gap-3">
              <span className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-black">1</span>
              ما هي المشاعر التي شعرت بها؟ (بنك 24 عاطفة)
            </label>
            <span className="bg-pink-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm">10 درجات</span>
          </div>
          <button 
            onClick={() => setIsEmotionBankOpen(!isEmotionBankOpen)}
            className="bg-pink-50 text-pink-700 px-6 py-2 rounded-2xl font-bold border border-pink-200 hover:bg-pink-100 transition shadow-sm"
          >
            {isEmotionBankOpen ? '✖ أغلق بنك المشاعر' : '🔍 افتح بنك المشاعر'}
          </button>
        </div>
        
        {isEmotionBankOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-8 p-6 bg-pink-50/20 rounded-3xl border border-pink-100 animate-fade-in" role="group">
            {EMOTIONS.map((emo) => {
              const isSelected = emotions.some(e => e.id === emo.id);
              return (
                <button
                  key={emo.id}
                  onClick={() => toggleEmotion(emo)}
                  aria-pressed={isSelected}
                  className={`relative group p-2 rounded-2xl border transition-all flex flex-col items-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    isSelected ? 'border-pink-600 bg-pink-50 shadow-md scale-105' : 'border-slate-100 bg-white hover:border-pink-200'
                  }`}
                >
                  <img src={emo.imageUrl} alt={emo.name} className="w-full h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-pink-900' : 'text-slate-600'}`}>{emo.name}</span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <label className="block font-bold text-slate-700">تفصيل المشاعر ومدى حدتها:</label>
            <span className="bg-slate-700 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm">5 درجات</span>
          </div>
          <textarea
            value={answers[0]}
            onChange={(e) => onAnswerChange(0, e.target.value)}
            className="w-full h-32 p-4 border-2 border-slate-100 rounded-2xl focus:border-pink-400 outline-none transition-shadow text-slate-700 shadow-inner"
            placeholder="صف مشاعرك بتفصيل عميق..."
          ></textarea>
        </div>

        {emotions.length > 0 && (
          <div className="bg-slate-50 p-6 rounded-2xl space-y-4 animate-fade-in">
            <h4 className="font-bold text-slate-700 border-b pb-2">تحديد الحدة (1-10):</h4>
            {emotions.map(emo => (
              <div key={emo.id} className="flex flex-col sm:flex-row items-center gap-4">
                <span className="w-24 font-bold text-slate-600">{emo.name}</span>
                <input 
                  type="range" min="1" max="10" 
                  value={emo.intensity} 
                  onChange={(e) => updateIntensity(emo.id, parseInt(e.target.value))}
                  className="flex-grow accent-pink-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-8 text-center font-black text-pink-600">{emo.intensity}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Thoughts Selection Section */}
      <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-lg relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="thoughts-input" className="text-xl font-bold text-slate-700 flex items-center gap-3">
              <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black">2</span>
              ما هي الأفكار التي راودتك؟
            </label>
            <span className="bg-amber-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm">5 درجات</span>
          </div>
          <button 
            onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)}
            className="bg-amber-50 text-amber-700 px-6 py-2 rounded-2xl font-bold border border-amber-200 hover:bg-amber-100 transition shadow-sm"
          >
            {isThoughtBankOpen ? '✖ أغلق بنك الأفكار' : '💡 افتح بنك الأفكار'}
          </button>
        </div>

        {isThoughtBankOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 p-6 bg-amber-50/20 rounded-3xl border border-amber-100 animate-fade-in">
            <p className="col-span-full text-amber-900 font-bold mb-2">أمثلة على الأفكار التلقائية (اضغط للنسخ):</p>
            {IDENTIFICATION_THOUGHTS.map((thought, idx) => (
              <button
                key={idx}
                onClick={() => onAnswerChange(1, (answers[1] ? answers[1] + '\n' : '') + thought)}
                className="text-right p-3 bg-white border border-amber-100 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all text-slate-700 text-sm font-medium shadow-sm"
              >
                "{thought}"
              </button>
            ))}
          </div>
        )}
        
        <textarea
          id="thoughts-input"
          value={answers[1]}
          onChange={(e) => onAnswerChange(1, e.target.value)}
          className="w-full h-40 p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-400 outline-none transition-shadow text-slate-700 shadow-inner"
          placeholder="ماذا دار في ذهنك في تلك اللحظات؟ (أفكار تلقائية، أحكام، مخاوف...)"
        ></textarea>
      </section>

      {/* Motivation and Needs Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="block font-bold text-slate-700">3. دافع داخلي أم خارجي؟ (لماذا؟)</label>
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm">5 درجات</span>
          </div>
          <textarea
            value={answers[2]}
            onChange={(e) => onAnswerChange(2, e.target.value)}
            className="w-full h-32 p-4 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-shadow text-slate-700 shadow-inner"
            placeholder="ما الذي دفعك للتصرف؟ رغبة في التعلم، خوف من العلامة، ضغط اجتماعي؟..."
          ></textarea>
        </section>
        <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="block font-bold text-slate-700">4. هل تم إشباع الاحتياجات الثلاثة؟ (الاستقلالية، الكفاءة والانتماء)</label>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm">5 درجات</span>
          </div>
          <textarea
            value={answers[3]}
            onChange={(e) => onAnswerChange(3, e.target.value)}
            className="w-full h-32 p-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-400 outline-none transition-shadow text-slate-700 shadow-inner"
            placeholder="اشرح كيف تجلى كل احتياج أو كيف تضرر..."
          ></textarea>
        </section>
      </div>
    </div>
  );
};

export default Step2;


import React from 'react';

interface Step34Props {
  answers: string[]; // ans-6,7,8 (Step 3) OR ans-9,10 (Step 4)
  onAnswerChange: (idx: number, val: string) => void;
  isStep4: boolean;
}

const Step34: React.FC<Step34Props> = ({ answers, onAnswerChange, isStep4 }) => {
  if (!isStep4) {
    return (
      <div className="animate-fade-in space-y-10 text-right">
        <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white mb-10 shadow-xl">
          <h2 className="text-3xl font-black mb-2">المرحلة الثالثة: السلوك والاستجابة (التنظيم وتحقيق الأهداف)</h2>
          <p className="opacity-80 text-lg italic">تحليل أفعال الاستجابة وتأثيرها على الهدف.</p>
        </div>
        
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-indigo-400 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-bold text-indigo-900 text-xl">
                1. فحص التنظيم العاطفي: هل كانت الاستجابة اندفاعية أم متوافقة مع الموقف؟
              </label>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">6 درجات</span>
            </div>
            <textarea
              value={answers[0]}
              onChange={(e) => onAnswerChange(0, e.target.value)}
              className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-inner text-slate-800"
              placeholder="اشرح بتفصيل كبير..."
            ></textarea>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-indigo-500 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-bold text-indigo-900 text-xl">
                2. التقدم نحو الغايات والأهداف: هل قربتك الاستجابة من الهدف أم أبعدتك عنه؟
              </label>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">6 درجات</span>
            </div>
            <textarea
              value={answers[1]}
              onChange={(e) => onAnswerChange(1, e.target.value)}
              className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-inner text-slate-800"
              placeholder="كيف أثرت الاستجابة على النتيجة النهائية التي رغبت في تحقيقها؟"
            ></textarea>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-indigo-600 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-bold text-indigo-900 text-xl">
                3. الشعور بالكفاءة الذاتية: كيف أثر إيمانك بقدرتك على جودة الأداء؟
              </label>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">6 درجات</span>
            </div>
            <textarea
              value={answers[2]}
              onChange={(e) => onAnswerChange(2, e.target.value)}
              className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-inner text-slate-800"
              placeholder="كيف أثر مستوى ثقتك في المهمة على الأداء الفعلي؟"
            ></textarea>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 text-right">
      <div className="bg-slate-800 p-10 rounded-[2.5rem] text-white mb-10 shadow-2xl">
        <h2 className="text-3xl font-black mb-2">المرحلة الرابعة: التعلم وتحليل آليات التنظيم</h2>
        <p className="opacity-80 text-lg italic text-center">فهم ديناميكية حلقة النجاح مقابل حلقة الفشل.</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border shadow-2xl mb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600"></div>
        <h3 className="text-3xl font-black text-slate-800 mb-10 tracking-tight uppercase underline decoration-blue-500 decoration-4 underline-offset-8">كيف نكسر الحلقة السلبية؟</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-emerald-500 text-white px-8 py-5 rounded-[1.5rem] shadow-xl font-bold border-2 border-emerald-600 text-sm">الشعور بالكفاءة الذاتية</div>
          <div className="text-5xl text-slate-300 transform rotate-90 md:rotate-0">➜</div>
          <div className="bg-blue-500 text-white px-8 py-5 rounded-[1.5rem] shadow-xl font-bold border-2 border-blue-600 text-sm">الإنجازات والأداء العالي</div>
          <div className="text-5xl text-slate-300 transform rotate-90 md:rotate-0">➜</div>
          <div className="bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] shadow-xl font-bold border-2 border-indigo-700 text-sm">النمو وتطوير التنظيم</div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="bg-rose-50 p-8 rounded-[2.5rem] border-t-8 border-rose-500 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <label className="block font-bold text-slate-800 text-2xl italic">
              1. تحليل الحلقة: هل تطور الحدث إلى حلقة نجاح أم حلقة فشل؟ اشرح لماذا.
            </label>
            <span className="bg-rose-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">6 درجات</span>
          </div>
          <textarea
            value={answers[3]}
            onChange={(e) => onAnswerChange(3, e.target.value)}
            className="w-full h-48 p-6 rounded-2xl border-2 border-slate-100 focus:border-rose-400 outline-none transition-all shadow-inner text-slate-800"
            placeholder="اشرح بتفصيل عميق..."
          ></textarea>
        </div>
        
        <div className="bg-amber-50 p-8 rounded-[2.5rem] border-t-8 border-amber-500 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <label className="block font-bold text-slate-800 text-2xl italic">
              2. مراحل التنظيم: أين حددت صعوبة مركزية - في التخطيط، في المراقبة أم في التقييم؟
            </label>
            <span className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shrink-0">6 درجات</span>
          </div>
          <textarea
            value={answers[4]}
            onChange={(e) => onAnswerChange(4, e.target.value)}
            className="w-full h-48 p-6 rounded-2xl border-2 border-slate-100 focus:border-amber-400 outline-none transition-all shadow-inner text-slate-800"
            placeholder="اشرح بتفصيل عميق..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Step34;

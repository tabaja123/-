
import React, { useState, useEffect } from 'react';

interface Slide {
  title: string;
  subtitle?: string;
  content: string[];
  color: string;
  icon: string;
}

const SLIDES: Slide[] = [
  {
    title: "نموذج بينتريتش للتنظيم الذاتي",
    subtitle: "Pintrich's Model of Self-Regulated Learning (SRL)",
    content: [
      "يرى بينتريتش أن التنظيم الذاتي هو عملية نشطة يقوم فيها المتعلمون بوضع أهداف لتعلمهم.",
      "تتفاعل في هذا النموذج 4 مراحل أساسية مع 4 مجالات (المعرفي، الدافعي، السلوكي، والسياقي).",
      "الهدف: تحويل الطالب إلى متعلم مستقل ومسؤول عن نتائجه."
    ],
    color: "from-blue-900 to-indigo-900",
    icon: "🎓"
  },
  {
    title: "المرحلة 1: التخطيط والتمهيد",
    subtitle: "Forethought, Planning, and Activation",
    content: [
      "تنشيط المعرفة السابقة حول المهمة.",
      "تحديد الأهداف الأولية (ماذا أريد أن أحقق؟).",
      "تنشيط المعتقدات الدافعية (هل أستطيع فعل ذلك؟)."
    ],
    color: "from-sky-500 to-blue-700",
    icon: "🎯"
  },
  {
    title: "المرحلة 2: المراقبة",
    subtitle: "Monitoring",
    content: [
      "الوعي بالعمليات الذهنية (هل أفهم ما يحدث؟).",
      "مراقبة الحالة العاطفية (كيف أشعر تجاه المهمة؟).",
      "رصد الوقت والجهد المبذولين."
    ],
    color: "from-pink-500 to-rose-700",
    icon: "🔍"
  },
  {
    title: "المرحلة 3: التحكم والضبط",
    subtitle: "Control",
    content: [
      "اختيار استراتيجيات معرفية لتعديل الأداء.",
      "إدارة المشاعر (كيف أهدئ نفسي عند الإحباط؟).",
      "تعديل السلوك وتغيير بيئة التعلم إذا لزم الأمر."
    ],
    color: "from-indigo-500 to-purple-700",
    icon: "⚙️"
  },
  {
    title: "المرحلة 4: التقييم ورد الفعل",
    subtitle: "Reaction and Reflection",
    content: [
      "تقييم الأداء النهائي مقارنة بالأهداف.",
      "تحديد أسباب النجاح أو الفشل (العزو السببي).",
      "تطوير استراتيجيات جديدة للمواقف المستقبلية."
    ],
    color: "from-emerald-500 to-teal-700",
    icon: "📊"
  },
  {
    title: "هيا بنا نطبق الموديل!",
    subtitle: "تحويل النظرية إلى ممارسة شخصية",
    content: [
      "ستقوم الآن بتحليل موقف شخصي مررت به.",
      "اتبع مراحل بينتريتش بدقة في كل مرحلة من النشاط.",
      "تذكر: التفصيل هو مفتاح النجاح في هذا التحليل."
    ],
    color: "from-amber-500 to-orange-600",
    icon: "🚀"
  }
];

const PresentationMode: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') prev();
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const next = () => setCurrentSlide(prev => Math.min(SLIDES.length - 1, prev + 1));
  const prev = () => setCurrentSlide(prev => Math.max(0, prev - 1));

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-40 transition-all duration-1000`}></div>
      <div className="absolute top-10 right-10 flex gap-4 z-10">
        <button 
          onClick={onExit}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold border border-white/20 transition backdrop-blur-md"
        >
          خروج من العرض ✖
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10">
        <div 
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 w-full max-w-5xl px-12 animate-fade-in text-white text-right">
        <div className="text-8xl mb-8 animate-bounce">{slide.icon}</div>
        <h1 className="text-6xl md:text-7xl font-black mb-4 drop-shadow-lg leading-tight">{slide.title}</h1>
        {slide.subtitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-white/80 mb-12 border-r-8 border-white pr-6 ltr text-left" dir="ltr">
            {slide.subtitle}
          </h2>
        )}
        
        <ul className="space-y-6">
          {slide.content.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-2xl md:text-3xl font-medium leading-relaxed animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
              <span className="mt-2 w-3 h-3 bg-white rounded-full shrink-0"></span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center z-20">
        <div className="flex gap-4">
          <button 
            onClick={prev}
            disabled={currentSlide === 0}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 flex items-center justify-center text-4xl text-white transition backdrop-blur-md border border-white/20"
          >
            →
          </button>
          <button 
            onClick={next}
            disabled={currentSlide === SLIDES.length - 1}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 flex items-center justify-center text-4xl text-white transition backdrop-blur-md border border-white/20"
          >
            ←
          </button>
        </div>
        <div className="text-white/60 font-bold text-xl">
          {currentSlide + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;

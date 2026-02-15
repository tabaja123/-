
import React, { useState } from 'react';
import { ThoughtPair, Language } from '../../types';
import { GoogleGenAI, Modality } from "@google/genai";
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const t = translations[language] as any;

  const playAudioMediation = async () => {
    if (isSpeaking || isLoadingAudio) return;
    setIsLoadingAudio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: t.step5_tts }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: t.voice } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        
        setIsLoadingAudio(false);
        setIsSpeaking(true);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
      } else {
        setIsLoadingAudio(false);
      }
    } catch (e) { 
      setIsLoadingAudio(false);
      setIsSpeaking(false); 
    }
  };

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) onUpdate({ selectedTools: selectedTools.filter(t => t !== tool) });
    else onUpdate({ selectedTools: [...selectedTools, tool] });
  };

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <div className="bg-teal-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-teal-700">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">🎙️</div>
          <div className="flex-grow">
            <h3 className="text-2xl font-black mb-1">{t.step5_name}</h3>
            <p className="text-teal-200 mb-4">{t.step5_instr}</p>
            <button 
              onClick={playAudioMediation} 
              disabled={isSpeaking || isLoadingAudio} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoadingAudio ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {language === 'ar' ? 'جاري التحميل...' : 'טוען שמע...'}
                </>
              ) : isSpeaking ? t.reading : t.listenInstructions}
            </button>
          </div>
        </div>
      </div>

      <section className="bg-amber-50 p-10 rounded-[3rem] border-4 border-amber-100 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-amber-900">🧠 1. {t.reframingTitle}</h3>
            <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-black">4 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsStylesBankOpen(!isStylesBankOpen)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg text-sm">{isStylesBankOpen ? t.close : t.thinkingStylesBank}</button>
            <button onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)} className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg text-sm">{isThoughtBankOpen ? t.close : (language === 'ar' ? 'أمثلة' : 'דוגמאות')}</button>
          </div>
        </div>
        {isThoughtBankOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.thought_pairs.map((pair: ThoughtPair, idx: number) => (
              <React.Fragment key={idx}>
                <div className="bg-white p-5 rounded-2xl border-2 border-red-50 font-bold text-red-600 shadow-sm">❌ {pair.original}</div>
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-50 font-bold text-emerald-600 shadow-sm">✅ {pair.alternative}</div>
              </React.Fragment>
            ))}
          </div>
        )}
        <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-3xl border-2 outline-none text-right shadow-inner bg-white/50 font-medium focus:border-amber-400" placeholder={t.placeholder_step5}></textarea>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {t.tool_banks.map((bank: any, bIdx: number) => (
          <div key={bIdx} className="p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-6 border-b-4 border-blue-100 pb-2">
              <h4 className="font-black text-slate-800 text-xl">{bank.title}</h4>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">4 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {bank.tools.map((tool: string, tIdx: number) => (
                <button key={tIdx} onClick={() => toggleTool(tool)} className={`px-5 py-3 rounded-2xl text-sm font-black flex items-center gap-3 transition-all ${selectedTools.includes(tool) ? 'bg-slate-800 text-white scale-105 shadow-xl' : 'bg-white border-2 hover:bg-slate-100'}`}><span className="text-2xl">{TOOL_ICONS[tool] || '🔧'}</span><span>{tool}</span></button>
              ))}
            </div>
            <textarea value={answers[bIdx + 1]} onChange={(e) => onAnswerChange(bIdx + 1, e.target.value)} className="w-full h-40 p-5 rounded-2xl outline-none bg-white border-2 text-right shadow-sm focus:border-blue-500" placeholder={t.placeholder_step5}></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step5;

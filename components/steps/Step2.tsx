
import React, { useState } from 'react';
import { EMOTIONS } from '../../constants';
import { EmotionSelection, Language } from '../../types';
import { GoogleGenAI, Modality } from "@google/genai";
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const t = translations[language] as any;

  const playAudioMediation = async () => {
    if (isSpeaking || isLoadingAudio) return;
    setIsLoadingAudio(true);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") throw new Error("API_KEY missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: t.step2_tts }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: t.voice } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        if (audioContext.state === 'suspended') await audioContext.resume();

        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer, 0, Math.floor(bytes.length / 2));
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
      console.error("Audio error Step 2:", e);
      setIsLoadingAudio(false);
      setIsSpeaking(false); 
      alert(language === 'ar' ? "فشل تشغيل الصوت." : "נכשל בהפעלת האודיו.");
    }
  };

  const toggleEmotion = (emotion: { id: string, name: string }) => {
    const exists = emotions.find(e => e.id === emotion.id);
    if (exists) onUpdate({ emotions: emotions.filter(e => e.id !== emotion.id) });
    else onUpdate({ emotions: [...emotions, { ...emotion, intensity: 5 }] });
  };

  const getEmotionName = (emo: any) => {
    if (language === 'ar') return emo.name;
    const heMap: Record<string, string> = {
      'فرح': 'שמחה', 'غضب': 'כעס', 'חزن': 'עצב', 'خوف': 'פחד', 'احباط': 'תסכול',
      'خجل': 'בושה', 'رفض': 'דחייה', 'ازدراء': 'בוז', 'حماس': 'התלהבות', 'راحة': 'רוגע',
      'فخر': 'גאווה', 'ذنب': 'אשמה', 'חסد': 'קנאה', 'ملل': 'שעמום', 'ارتباك': 'בלבול',
      'وحدة': 'בדידות', 'دهشة': 'הפתעה', 'قلق': 'חרדה', 'رضا': 'שביעות רצון', 'تعب': 'עייפות',
      'عجز': 'חוסר אונים', 'أمل': 'תקווה', 'ندמ': 'חרטה', 'فضول': 'סקרנות'
    };
    return heMap[emo.name] || emo.name;
  };

  const autoThoughts = [t.auto_thought_1, t.auto_thought_2, t.auto_thought_3, t.auto_thought_4, t.auto_thought_5];
  const needs = [
    { title: t.need_autonomy_title, desc: t.need_autonomy_desc, ex: t.need_autonomy_ex, icon: '🔓' },
    { title: t.need_competence_title, desc: t.need_competence_desc, ex: t.need_competence_ex, icon: '🏆' },
    { title: t.need_relatedness_title, desc: t.need_relatedness_desc, ex: t.need_relatedness_ex, icon: '🤝' }
  ];

  return (
    <div className="space-y-12 animate-fade-in text-right">
      <div className="bg-indigo-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-indigo-700">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">🎙️</div>
          <div className="flex-grow">
            <h3 className="text-2xl font-black mb-1">{t.emotionsTitle}</h3>
            <p className="text-indigo-100 mb-4">{t.step2_instr}</p>
            <button 
              onClick={playAudioMediation} 
              disabled={isSpeaking || isLoadingAudio} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              {isLoadingAudio ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {language === 'ar' ? 'تحميل...' : 'טוען...'}
                </>
              ) : isSpeaking ? t.reading : t.listenInstructions}
            </button>
          </div>
        </div>
      </div>

      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.emotionBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsEmotionBankOpen(!isEmotionBankOpen)} className="bg-pink-50 text-pink-700 px-8 py-3 rounded-2xl font-black border-2 border-pink-100 hover:bg-pink-100">
            {isEmotionBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isEmotionBankOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-10 p-8 bg-pink-50/20 rounded-[2.5rem] animate-fade-in">
            {EMOTIONS.map((emo) => (
              <button key={emo.id} onClick={() => toggleEmotion(emo)} className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${emotions.some(e => e.id === emo.id) ? 'border-pink-600 bg-pink-50 scale-105 shadow-md' : 'bg-white border-transparent shadow-sm'}`}>
                <img src={emo.imageUrl} alt={emo.name} className="w-full h-16 rounded-xl object-cover" />
                <span className="text-xs font-black">{getEmotionName(emo)}</span>
              </button>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_feelings} (5 {language === 'ar' ? 'نقاط' : 'נק\''})</label>
        <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-32 p-5 border-2 outline-none rounded-2xl text-right focus:border-blue-500 shadow-inner bg-slate-50/20" placeholder={t.describeCase}></textarea>
      </section>

      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.thoughtBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsThoughtBankOpen(!isThoughtBankOpen)} className="bg-blue-50 text-blue-700 px-8 py-3 rounded-2xl font-black border-2 border-blue-100 hover:bg-blue-100">
            {isThoughtBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isThoughtBankOpen && (
          <div className="flex flex-wrap gap-3 mb-10 p-8 bg-blue-50/20 rounded-[2.5rem] animate-fade-in">
            {autoThoughts.map((thought, i) => (
              <button key={i} onClick={() => onAnswerChange(1, (answers[1] ? answers[1] + ', ' : '') + thought)} className="bg-white border-2 border-blue-200 px-4 py-2 rounded-xl text-sm font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                {thought}
              </button>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_thoughts}</label>
        <textarea value={answers[1]} onChange={(e) => onAnswerChange(1, e.target.value)} className="w-full h-32 p-5 border-2 outline-none rounded-2xl text-right focus:border-blue-500 shadow-inner bg-slate-50/20" placeholder={t.describeCase}></textarea>
      </section>

      <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <label className="text-2xl font-black text-slate-800">{t.needsBank}:</label>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
          </div>
          <button onClick={() => setIsNeedsBankOpen(!isNeedsBankOpen)} className="bg-teal-50 text-teal-700 px-8 py-3 rounded-2xl font-black border-2 border-teal-100 hover:bg-teal-100">
            {isNeedsBankOpen ? t.close : t.open_bank}
          </button>
        </div>
        {isNeedsBankOpen && (
          <div className="grid md:grid-cols-3 gap-6 mb-10 p-8 bg-teal-50/20 rounded-[2.5rem] animate-fade-in">
            {needs.map((need, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-xl flex flex-col items-center text-center group transition-all hover:scale-105">
                <span className="text-5xl mb-4">{need.icon}</span>
                <span className="text-teal-900 font-black text-xl mb-3">{need.title}</span>
                <p className="text-sm text-slate-700 font-bold mb-3">{need.desc}</p>
                <button onClick={() => onAnswerChange(2, (answers[2] ? answers[2] + ', ' : '') + need.title)} className="mt-auto bg-teal-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-teal-700 shadow-lg w-full">
                  {language === 'ar' ? 'اختيار' : 'בחר'}
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block font-black text-slate-700 mb-3 text-xl">{t.label_needs}</label>
        <textarea value={answers[2]} onChange={(e) => onAnswerChange(2, e.target.value)} className="w-full h-32 p-5 border-2 outline-none rounded-2xl text-right focus:border-blue-500 shadow-inner bg-slate-50/20" placeholder={t.describeCase}></textarea>
      </section>
    </div>
  );
};

export default Step2;

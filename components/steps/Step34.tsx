
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../../types';
import { translations } from '../../locales';

interface Step34Props {
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  isStep4: boolean;
  language: Language;
}

const Step34: React.FC<Step34Props> = ({ answers, onAnswerChange, isStep4, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isResponseBankOpen, setIsResponseBankOpen] = useState(false);
  const t = translations[language];

  const playAudioMediation = async () => {
    if (isSpeaking || isLoadingAudio) return;
    setIsLoadingAudio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: isStep4 ? t.step4_tts : t.step3_tts }] }],
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

  const regulatedExamples = [t.resp_reg_1, t.resp_reg_2, t.resp_reg_3, t.resp_reg_4];
  const impulsiveExamples = [t.resp_imp_1, t.resp_imp_2, t.resp_imp_3, t.resp_imp_4];

  const addToResponse = (text: string) => {
    const current = answers[0] || '';
    const updated = current.length > 0 ? `${current}, ${text}` : text;
    onAnswerChange(0, updated);
  };

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <div className={`p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 ${isStep4 ? 'bg-emerald-800 border-emerald-600' : 'bg-blue-900 border-blue-600'} text-white`}>
        <div className="flex items-center gap-5 text-right flex-grow">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">{isStep4 ? '📊' : '⚙️'}</div>
          <div className="flex-grow">
            <h3 className="text-2xl font-black mb-1">{isStep4 ? t.step4_name : t.step3_name}</h3>
            <p className="text-blue-100 mb-4">{isStep4 ? t.step4_instr : t.step3_instr}</p>
            <button 
              onClick={playAudioMediation} 
              disabled={isSpeaking || isLoadingAudio} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black shadow-lg transition active:scale-95 flex items-center gap-2"
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

      {!isStep4 ? (
        <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h4 className="text-2xl font-black text-slate-800">{t.responseBankTitle}:</h4>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
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
          <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-3xl border-2 outline-none text-right focus:border-blue-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
        </section>
      ) : (
        <div className="space-y-12">
          <section className="bg-white p-12 rounded-[3.5rem] border-4 border-slate-100 shadow-2xl flex flex-col items-center">
             <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_efficacy}</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-400 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_performance}</div>
                <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg z-10">{(t as any).cycle_achievements}</div>
                <div className="absolute inset-10 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500 fill-current opacity-80"><path d="M 50,10 A 40,40 0 1,1 10,50" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" /><polygon points="10,50 0,40 20,40" /></svg>
                </div>
             </div>
             <p className="mt-12 text-center text-slate-600 font-bold max-w-lg mx-auto leading-relaxed">
                {(language === 'ar' ? 'تفاعل هذه العناصر يخلق حلقة تغذية راجعة تقوي مهارات التنظيم الذاتي لديك.' : 'הקשר בין המרכיבים הללו יוצר לולאת משוב שמחזקת את יכולת הוויסות העצמי שלך.')}
             </p>
          </section>

          <div className="bg-white p-10 rounded-[3rem] border-r-8 border-emerald-500 shadow-xl space-y-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block font-black text-slate-800 text-xl">{t.label_evaluation}</label>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-black">7 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
              </div>
              <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-44 p-6 rounded-3xl border-2 outline-none text-right focus:border-emerald-500 shadow-inner bg-slate-50/30" placeholder={t.describeCase}></textarea>
            </div>
            <div className="pt-8 border-t-2 border-slate-50">
              <div className="flex justify-between items-center mb-4">
                <label className="block font-black text-slate-800 text-xl">{(t as any).label_efficacy_analysis}</label>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">8 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
              </div>
              <textarea value={answers[2]} onChange={(e) => onAnswerChange(2, e.target.value)} className="w-full h-44 p-6 rounded-3xl border-2 outline-none text-right focus:border-blue-500 shadow-inner bg-blue-50/30" placeholder={t.describeCase}></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step34;

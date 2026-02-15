
import React, { useState } from 'react';
import { AppState, Language } from '../../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { translations } from '../../locales';

interface Step6Props {
  state: AppState;
  answers: string[];
  onAnswerChange: (idx: number, val: string) => void;
  isSubmitted: boolean;
  onUpdate: (updates: any) => void;
  studentName: string;
  language: Language;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const Step6: React.FC<Step6Props> = ({ state, answers, onAnswerChange, isSubmitted, onUpdate, studentName, language }) => {
  const [submissionCode, setSubmissionCode] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isTimingGuideOpen, setIsTimingGuideOpen] = useState(true);
  const t = translations[language];

  const playAudioMediation = async () => {
    if (isSpeaking || isLoadingAudio) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined") return;
    setIsLoadingAudio(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: t.step6_tts }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: t.voice } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        if (audioContext.state === 'suspended') await audioContext.resume();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => { setIsSpeaking(false); audioContext.close(); };
        setIsLoadingAudio(false);
        setIsSpeaking(true);
        source.start(0);
      }
    } catch (e) {
      setIsLoadingAudio(false);
      setIsSpeaking(false);
    }
  };

  const safeBtoa = (str: string) => {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
    } catch (e) { return "error"; }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = safeBtoa(JSON.stringify(state));
    setSubmissionCode(code);
    onUpdate({ isSubmitted: true });
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in py-16 px-6 bg-white rounded-[3.5rem] border-4 border-emerald-100 shadow-2xl max-w-2xl mx-auto w-full text-center" dir="rtl">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl font-bold">✓</div>
        <h3 className="text-3xl font-black text-slate-900 mb-4">{t.successCode}</h3>
        <p className="text-slate-500 text-lg mb-10">{language === 'ar' ? 'قم بنسخ هذا الكود وإرساله للمحاضر.' : 'העתיקו את הקוד הבא ושלחו אותו למרצה.'}</p>
        <div className="bg-slate-50 p-8 rounded-[2rem] mb-8 border-4 border-dashed border-slate-200">
          <div className="break-all text-[10px] bg-white p-5 rounded-2xl border mb-6 font-mono max-h-32 overflow-y-auto text-left" dir="ltr">{submissionCode}</div>
          <button onClick={() => {navigator.clipboard.writeText(submissionCode); alert(language === 'ar' ? "تم النسخ!" : "הקוד הועתק!");}} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl">
            📋 {t.copyCode}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-slate-700">
        <div className="flex items-center gap-5 text-right">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">🚀</div>
          <div className="flex-grow">
            <h3 className="text-2xl font-black mb-1">{t.step6_name}</h3>
            <p className="text-slate-400 mb-4">{t.step6_instr}</p>
            <button 
              onClick={playAudioMediation} 
              disabled={isSpeaking || isLoadingAudio} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoadingAudio ? '...' : isSpeaking ? t.reading : t.listenInstructions}
            </button>
          </div>
        </div>
      </div>

      <section className="bg-white p-10 rounded-[3rem] border-2 border-amber-100 shadow-xl overflow-hidden relative">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span className="bg-amber-100 p-2 rounded-xl text-amber-600">💡</span>
            {t.timing_guide_title}
          </h4>
          <button onClick={() => setIsTimingGuideOpen(!isTimingGuideOpen)} className="bg-amber-50 text-amber-700 px-6 py-2 rounded-xl font-bold border border-amber-200">
            {isTimingGuideOpen ? t.close : t.open_bank}
          </button>
        </div>

        {isTimingGuideOpen && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-sky-50 p-6 rounded-[2rem] border-2 border-sky-100 transition-all hover:scale-105">
              <div className="text-3xl mb-3">🕒</div>
              <h5 className="font-black text-sky-900 mb-2">{t.timing_before_title}</h5>
              <p className="text-xs text-sky-800 leading-relaxed font-medium">{t.timing_before_desc}</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-100 transition-all hover:scale-105">
              <div className="text-3xl mb-3">🔥</div>
              <h5 className="font-black text-orange-900 mb-2">{t.timing_during_title}</h5>
              <p className="text-xs text-orange-800 leading-relaxed font-medium">{t.timing_during_desc}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-100 transition-all hover:scale-105">
              <div className="text-3xl mb-3">📖</div>
              <h5 className="font-black text-emerald-900 mb-2">{t.timing_after_title}</h5>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">{t.timing_after_desc}</p>
            </div>
          </div>
        )}
      </section>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-10">
        <div className="space-y-8">
          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-black text-xl text-slate-800">{t.label_warning}</label>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <textarea value={answers[0]} onChange={(e) => onAnswerChange(0, e.target.value)} className="w-full h-32 p-5 rounded-2xl outline-none text-right bg-white border-2 border-transparent focus:border-blue-500 transition-all shadow-sm" placeholder={t.placeholder_step6}></textarea>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-black text-xl text-slate-800">{t.label_firstStep}</label>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <textarea value={answers[1]} onChange={(e) => onAnswerChange(1, e.target.value)} className="w-full h-32 p-5 rounded-2xl outline-none text-right bg-white border-2 border-transparent focus:border-blue-500 transition-all shadow-sm" placeholder={t.placeholder_step6}></textarea>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-black text-xl text-slate-800">{t.label_maintenance}</label>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <textarea value={answers[2]} onChange={(e) => onAnswerChange(2, e.target.value)} className="w-full h-32 p-5 rounded-2xl outline-none text-right bg-white border-2 border-transparent focus:border-blue-500 transition-all shadow-sm" placeholder={t.placeholder_step6}></textarea>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border-r-8 border-blue-600 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-black text-xl text-slate-800">{t.label_doDifferently}</label>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">5 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
            </div>
            <textarea value={answers[3]} onChange={(e) => onAnswerChange(3, e.target.value)} className="w-full h-32 p-5 rounded-2xl outline-none text-right bg-white border-2 border-transparent focus:border-blue-500 transition-all shadow-sm" placeholder={t.placeholder_step6}></textarea>
          </div>
        </div>
        <button onClick={handleSubmit} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-700 shadow-2xl transition-all active:scale-95">
          📮 {t.finishBtn}
        </button>
      </div>
    </div>
  );
};

export default Step6;

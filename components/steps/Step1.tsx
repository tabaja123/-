
import React, { useState } from 'react';
import { StudentData, Language } from '../../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { translations } from '../../locales';

interface Step1Props {
  data: StudentData;
  answer: string;
  onAnswerChange: (val: string) => void;
  onChange: (data: StudentData) => void;
  onNext: () => void;
  language: Language;
}

const Step1: React.FC<Step1Props> = ({ data, answer, onAnswerChange, onChange, onNext, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language] as any;

  const playAudioMediation = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: t.step1_tts }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: t.voice } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decode = (base64: string) => {
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          return bytes;
        };

        const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
          const dataInt16 = new Int16Array(data.buffer);
          const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
          return buffer;
        };

        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (error) {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12 text-right">
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[3rem] p-1 shadow-2xl overflow-hidden">
        <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 animate-pulse text-8xl">🎙️</div>
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <div className="inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{t.audioGuide}</div>
            <h2 className="text-4xl font-black">{t.step1_name}</h2>
            <p className="text-blue-100 text-lg leading-relaxed">{t.step1_instr}</p>
            <button onClick={playAudioMediation} disabled={isSpeaking} className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black text-xl transition shadow-2xl border-b-4 ${isSpeaking ? 'bg-slate-700' : 'bg-emerald-600 border-emerald-800 text-white'}`}>
              {isSpeaking ? t.reading : t.listenInstructions}
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
        <h2 className="text-3xl font-black text-slate-800 mb-8">{t.studentDataTitle}</h2>
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.fullName}:</label>
            <input type="text" value={data.fullName} onChange={(e) => onChange({ ...data, fullName: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.studentId}:</label>
            <input type="text" value={data.studentId} onChange={(e) => onChange({ ...data, studentId: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.email}:</label>
            <input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right" placeholder="example@email.com" />
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="block font-black text-slate-700 text-xl">{language === 'ar' ? 'وصف الموقف:' : 'תיאור המקרה:'}</label>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
        </div>
        <textarea value={answer} onChange={(e) => onAnswerChange(e.target.value)} className="w-full p-8 rounded-[2.5rem] border-2 min-h-[250px] outline-none text-right" placeholder={t.describeCase}></textarea>
      </div>
    </div>
  );
};

export default Step1;

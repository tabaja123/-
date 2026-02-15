
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

// Helper: Decode Base64 to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Convert PCM bytes to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Step1: React.FC<Step1Props> = ({ data, answer, onAnswerChange, onChange, onNext, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const t = translations[language] as any;

  const playAudioMediation = async () => {
    if (isSpeaking || isLoadingAudio) return;
    
    const apiKey = process.env.API_KEY;
    
    // Check for missing key and alert user clearly
    if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey === "null") {
      const msg = language === 'ar' 
        ? "مفتاح API غير متوفر. يرجى ضبط API_KEY في إعدادات Netlify." 
        : "מפתח API חסר. אנא הגדירו את API_KEY בהגדרות ה-Environment Variables ב-Netlify.";
      alert(msg);
      return;
    }

    setIsLoadingAudio(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
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
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContext,
          24000,
          1
        );

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          setIsSpeaking(false);
          if (audioContext.state !== 'closed') audioContext.close();
        };

        setIsLoadingAudio(false);
        setIsSpeaking(true);
        source.start(0);
      } else {
        throw new Error("Empty audio response from Gemini");
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsLoadingAudio(false);
      setIsSpeaking(false);
      alert(language === 'ar' ? "حدث خطأ في تشغيل الصوت." : "שגיאה בהפעלת האודיו. ייתכן שהמפתח אינו תקין.");
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
            <button 
              onClick={playAudioMediation} 
              disabled={isSpeaking || isLoadingAudio} 
              className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black text-xl transition shadow-2xl border-b-4 ${(isSpeaking || isLoadingAudio) ? 'bg-slate-700 opacity-80 cursor-not-allowed' : 'bg-emerald-600 border-emerald-800 text-white active:scale-95'}`}
            >
              {isLoadingAudio ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {language === 'ar' ? 'جاري التحضير...' : 'מכין שמע...'}
                </span>
              ) : isSpeaking ? t.reading : t.listenInstructions}
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
        <h2 className="text-3xl font-black text-slate-800 mb-8">{t.studentDataTitle}</h2>
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.fullName}:</label>
            <input type="text" value={data.fullName || ''} onChange={(e) => onChange({ ...data, fullName: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right focus:border-blue-500 bg-white" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.studentId}:</label>
            <input type="text" value={data.studentId || ''} onChange={(e) => onChange({ ...data, studentId: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right focus:border-blue-500 bg-white" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-2">{t.email}:</label>
            <input type="email" value={data.email || ''} onChange={(e) => onChange({ ...data, email: e.target.value })} className="w-full p-5 rounded-2xl border-2 outline-none text-right placeholder:text-slate-300 focus:border-blue-500 bg-white" placeholder="example@email.com" />
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="block font-black text-slate-700 text-xl">{language === 'ar' ? 'وصف الموقف:' : 'תיאור המקרה:'}</label>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">10 {language === 'ar' ? 'نقاط' : 'נק\''}</span>
        </div>
        <textarea value={answer || ''} onChange={(e) => onAnswerChange(e.target.value)} className="w-full p-8 rounded-[2.5rem] border-2 min-h-[250px] outline-none text-right focus:border-blue-500 bg-white" placeholder={t.describeCase}></textarea>
      </div>
    </div>
  );
};

export default Step1;

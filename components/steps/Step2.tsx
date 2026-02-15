
import React, { useState } from 'react';
import { EMOTIONS } from '../../constants';
import { EmotionSelection, Language } from '../../types';
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
  const t = translations[language] as any;

  const toggleEmotion = (emotion: { id: string, name: string }) => {
    const exists = emotions.find(e => e.id === emotion.id);
    if (exists) onUpdate({ emotions: emotions.filter(e => e.id !== emotion.id) });
    else onUpdate({ emotions

export type Language = 'ar' | 'he';

export interface StudentData {
  fullName: string;
  studentId: string;
  email: string;
}

export interface EmotionSelection {
  id: string;
  name: string;
  intensity: number;
}

export interface ThoughtPair {
  original: string;
  alternative: string;
}

export interface FeedbackData {
  finalGrade: number;
  comments: string;
  teacherName: string;
  timestamp: string;
}

export interface AppState {
  step: number;
  language: Language;
  student: StudentData;
  emotions: EmotionSelection[];
  answers: string[];
  reframing: ThoughtPair[];
  selectedTools: string[];
  isSubmitted: boolean;
  feedback?: FeedbackData;
}

export interface EmotionDefinition {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ToolBank {
  title: string;
  tools: string[];
}


export interface StudentData {
  fullName: string;
  studentId: string;
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

export interface AppState {
  step: number;
  student: StudentData;
  emotions: EmotionSelection[];
  // answers maps to ans-1 through ans-18 in the reference source
  answers: string[];
  reframing: ThoughtPair[];
  selectedTools: string[];
  isSubmitted: boolean;
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

export type UnitStatus = "completed" | "in_progress" | "next" | "not_started";

export type UnitMetadata = {
  unit: number;
  title: string;
  slug: string;
  part: string;
  priority: "foundation" | "active" | "future";
};

export type UnitProgressState = {
  unit: number;
  status: UnitStatus;
  mastery: number;
  weaknesses: string[];
};

export type UnitProgress = UnitMetadata & UnitProgressState;

export type UnitsData = {
  units: UnitMetadata[];
};

export type ContentLevel = "placeholder" | "review_notes" | "deep_notes";

export type ContentStatusRecord = {
  unit: number;
  level: ContentLevel;
};

export type ContentStatusData = {
  levels: Record<ContentLevel, string>;
  units: ContentStatusRecord[];
};

export type ProgressData = {
  units: UnitProgressState[];
};

export type UnitContent = {
  unit: number;
  slug: string;
  title: string;
  sections: {
    title: string;
    body: string;
  }[];
};

export type WrongAnswerCategory =
  | "Wish"
  | "Conditionals"
  | "Passive"
  | "Modal Verbs";

export type WrongAnswer = {
  id: string;
  category: WrongAnswerCategory;
  unit: number;
  prompt: string;
  wrongAnswer: string;
  correctAnswer: string;
  note: string;
  severity: number;
};

export type WrongAnswersData = {
  items: WrongAnswer[];
};

export type ReviewRecord = {
  unit: number;
  title: string;
  date: string;
  score: number;
  total: number;
  focus: string[];
  notes: string;
};

export type QuizSource =
  | "Grammar"
  | "TOEIC"
  | "IELTS"
  | "Daily English"
  | "Phrases"
  | "Native Usage";

export type QuizQuestion = {
  id: string;
  unit: number;
  source: QuizSource;
  topic: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanationEn: string;
  explanationZh: string;
  phraseNote?: string;
  breakdown?: {
    label: string;
    text: string;
    tone: "clue" | "structure" | "answer" | "warning";
  }[];
};

export type QuizQuestionsData = {
  questions: QuizQuestion[];
};

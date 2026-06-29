export type UnitStatus = "completed" | "in_progress" | "next";

export type UnitProgress = {
  unit: number;
  title: string;
  status: UnitStatus;
  mastery: number;
  weaknesses: string[];
};

export type ProgressData = {
  units: UnitProgress[];
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

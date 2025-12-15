export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  statement: string;
  options: Option[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
}

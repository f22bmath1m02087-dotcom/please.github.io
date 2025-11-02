export interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface ProbabilityQuestion {
  scenario: string;
  question: string;
  options: AnswerOption[];
  explanation: string;
}

export enum GameState {
  Welcome = 'WELCOME',
  Playing = 'PLAYING',
}

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}
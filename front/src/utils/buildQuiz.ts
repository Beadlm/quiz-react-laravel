import type { QuestionApi, QuizQuestion } from "../types/quiz";
import { shuffleArray } from "./shuffle";

const OPTIONS_PER_QUESTION = 4;
const QUESTIONS_PER_QUIZ = 10;

export function buildQuiz(rawQuestions: QuestionApi[]): QuizQuestion[] {
  const selected = shuffleArray(rawQuestions).slice(0, QUESTIONS_PER_QUIZ);

  return selected.map((q) => {
    const correctAnswer = q.reponse1;
    const wrongPool = [
      q.reponse2,
      q.reponse3,
      q.reponse4,
      q.reponse5,
      q.reponse6,
      q.reponse7,
      q.reponse8,
      q.reponse9,
      q.reponse10,
    ].filter((r) => r && r.trim().length > 0 && r !== correctAnswer);

    const wrongChoices = shuffleArray(wrongPool).slice(0, OPTIONS_PER_QUESTION - 1);
    const options = shuffleArray([correctAnswer, ...wrongChoices]);

    return {
      id: q.id,
      question: q.question,
      correctAnswer,
      options,
    };
  });
}

export { QUESTIONS_PER_QUIZ };

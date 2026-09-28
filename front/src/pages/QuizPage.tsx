import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnswerButton } from "../components/AnswerButton";
import { ErrorState } from "../components/ErrorState";
import { ProgressBar } from "../components/ProgressBar";
import { Spinner } from "../components/Spinner";
import { Timer } from "../components/Timer";
import { fetchQuestionsByCategory } from "../api/quizApi";
import { buildQuiz } from "../utils/buildQuiz";
import type { QuizQuestion } from "../types/quiz";

const QUESTION_DURATION_SECONDS = 30;
const FEEDBACK_DELAY_MS = 1200;

type LoadStatus = "loading" | "ready" | "error" | "empty";

interface LocationState {
  categoryName?: string;
}

export function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryName = (location.state as LocationState | null)?.categoryName;

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const advanceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!categoryName) {
      navigate("/categories", { replace: true });
    }
  }, [categoryName, navigate]);

  const loadQuestions = useCallback(() => {
    if (!categoryName) return;
    setStatus("loading");
    fetchQuestionsByCategory(categoryName)
      .then((raw) => {
        if (raw.length === 0) {
          setStatus("empty");
          return;
        }
        setQuestions(buildQuiz(raw));
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setStatus("ready");
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus("error");
      });
  }, [categoryName]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const goToNextQuestion = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= questions.length) {
        return prevIndex;
      }
      return nextIndex;
    });
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [questions.length]);

  const finishQuiz = useCallback(
    (finalScore: number) => {
      navigate("/result", {
        replace: true,
        state: { score: finalScore, total: questions.length, categoryName },
      });
    },
    [navigate, questions.length, categoryName]
  );

  const scheduleAdvance = useCallback(
    (finalScoreIfLast: number) => {
      advanceTimeoutRef.current = window.setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          finishQuiz(finalScoreIfLast);
        } else {
          goToNextQuestion();
        }
      }, FEEDBACK_DELAY_MS);
    },
    [currentIndex, questions.length, finishQuiz, goToNextQuestion]
  );

  const handleAnswerClick = (option: string) => {
    if (hasAnswered || !currentQuestion) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);

    setSelectedAnswer(option);
    setHasAnswered(true);
    setScore(newScore);
    scheduleAdvance(newScore);
  };

  const handleTimeout = () => {
    if (hasAnswered || !currentQuestion) return;
    setSelectedAnswer(null);
    setHasAnswered(true);
    scheduleAdvance(score);
  };

  if (status === "loading") {
    return (
      <div className="page">
        <Spinner label="Préparation du quiz…" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="page">
        <ErrorState message={errorMessage} onRetry={loadQuestions} />
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="page">
        <ErrorState
          message={`Aucune question n'est disponible pour la catégorie "${categoryName ?? ""}".`}
        />
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/categories")}>
          Choisir une autre catégorie
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="page quiz">
      <div className="quiz__header">
        <Timer
          resetKey={currentIndex}
          durationSeconds={QUESTION_DURATION_SECONDS}
          isPaused={hasAnswered}
          onTimeout={handleTimeout}
        />
      </div>

      <ProgressBar current={currentIndex} total={questions.length} />

      <h2 className="quiz__question">{currentQuestion.question}</h2>

      <div className="quiz__options">
        {currentQuestion.options.map((option) => (
          <AnswerButton
            key={option}
            label={option}
            isSelected={selectedAnswer === option}
            isCorrectAnswer={option === currentQuestion.correctAnswer}
            hasAnswered={hasAnswered}
            disabled={hasAnswered}
            onClick={() => handleAnswerClick(option)}
          />
        ))}
      </div>
    </div>
  );
}

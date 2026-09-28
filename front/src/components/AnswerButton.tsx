interface AnswerButtonProps {
  label: string;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  hasAnswered: boolean;
  disabled: boolean;
  onClick: () => void;
}

//vert bon rouge pas bon
export function AnswerButton({
  label,
  isSelected,
  isCorrectAnswer,
  hasAnswered,
  disabled,
  onClick,
}: AnswerButtonProps) {
  let modifier = "";
  if (hasAnswered) {
    if (isCorrectAnswer) {
      modifier = "answer-btn--correct";
    } else if (isSelected) {
      modifier = "answer-btn--wrong";
    } else {
      modifier = "answer-btn--muted";
    }
  }

  return (
    <button
      type="button"
      className={`answer-btn ${modifier}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}

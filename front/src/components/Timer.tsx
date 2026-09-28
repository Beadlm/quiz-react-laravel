import { useEffect, useRef, useState } from "react";

interface TimerProps {
  
  resetKey: number | string;
  durationSeconds: number;
  isPaused: boolean;
  onTimeout: () => void;
}

export function Timer({ resetKey, durationSeconds, isPaused, onTimeout }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    setSecondsLeft(durationSeconds);
  }, [resetKey, durationSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft, isPaused]);

  const percent = Math.max(0, (secondsLeft / durationSeconds) * 100);
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="timer" aria-live="polite">
      <div className="timer__bar-track">
        <div
          className={`timer__bar-fill ${isUrgent ? "timer__bar-fill--urgent" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

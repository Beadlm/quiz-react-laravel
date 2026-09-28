interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

//au cas ou on a pas de trucs
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Chargement…" }: SpinnerProps) {
  return (
    <div className="spinner-wrap" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

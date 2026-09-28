import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  score?: number;
  total?: number;
  categoryName?: string;
}

function messageFor(percent: number): string {
  if (percent === 100) {return "Absolument terrifiant "}
  else if (percent >= 50) {return "Ok ok c pas mal"}
  else {return "ouille ouille ouille t foutu la";}
  return "Bouuuuh trop nul";
}

export function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (state?.score === undefined || state?.total === undefined) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (state?.score === undefined || state?.total === undefined) {
    return null;
  }

  const { score, total, categoryName } = state;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="page page--centered result">
      <h1 className="result__title">Résultat</h1>
      {categoryName && <p className="result__category">Catégorie : {categoryName}</p>}
        <span className="result__score-value">
          {score}/{total}
        </span>

      <p className="result__message">{messageFor(percent)}</p>

      <div className="result__actions">
        <button type="button" className="btn btn--primary" onClick={() => navigate("/categories")}>
          Rejouer
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/")}>
          Accueil
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page page--centered home">
      <Logo size={112} />
      <h1 className="home__title">Culture Quiz</h1>
      <p className="home__subtitle">
        Choisis une catégorie. Si tu réponds pas bien aux questions on va chercher une personne de ta famille et on la fait passer au micro-ondes
      </p>
      <button type="button" className="btn btn--primary" onClick={() => navigate("/categories")}>
        Choisir catégorie
      </button>
    </div>
  );
}

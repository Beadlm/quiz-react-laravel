import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { Spinner } from "../components/Spinner";
import { fetchCategories } from "../api/quizApi";
import type { Category } from "../types/quiz";


export function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadCategories = useCallback(() => {
    setStatus("loading");
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setStatus("ready");
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSelect = (category: Category) => {
    navigate("/quiz", { state: { categoryName: category.name } });
  };

  return (
    <div className="page">
      <h1 className="page__title">Choisis une catégorie</h1>

      {status === "loading" && <Spinner label="Chargement des catégories…" />}

      {status === "error" && <ErrorState message={errorMessage} onRetry={loadCategories} />}

      {status === "ready" && categories.length === 0 && (
        <ErrorState message="Aucune catégorie n'est disponible pour le moment." onRetry={loadCategories} />
      )}

      {status === "ready" && categories.length > 0 && (
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="category-card"
              onClick={() => handleSelect(category)}
            >
              <span className="category-card__label">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

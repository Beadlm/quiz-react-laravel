import type { CategorieApi, Category, QuestionApi } from "../types/quiz";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {}

async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError(
      "A pas d'api lancée"
    );
  }

  if (!response.ok) {
    throw new ApiError(`API ERREUR (${response.status}).`);
  }

  return (await response.json()) as T;
}


export async function fetchCategories(): Promise<Category[]> {
  const raw = await getJson<CategorieApi[]>("/categories");
  return raw.map((c) => ({ id: c.id, name: c.categorie }));
}


export async function fetchQuestionsByCategory(categoryName: string): Promise<QuestionApi[]> {
  const raw = await getJson<QuestionApi[]>("/questions");
  return raw.filter((q) => q.categorie === categoryName);
}

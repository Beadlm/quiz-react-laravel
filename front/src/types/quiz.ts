export interface CategorieApi {
  id: number;
  categorie: string;
  created_at?: string;
  updated_at?: string;
}
export interface QuestionApi {
  id: number;
  categorie: string;
  question: string;
  reponse1: string; //bonne réponse **A SE SOUVENIR**
  reponse2: string;
  reponse3: string;
  reponse4: string;
  reponse5: string;
  reponse6: string;
  reponse7: string;
  reponse8: string;
  reponse9: string;
  reponse10: string;
  created_at?: string;
  updated_at?: string;
}


//classes front
export interface Category {
  id: number;
  name: string; //= CategorieApi.categorie
}


export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  options: string[];
}

export type AnswerStatus = "playing" | "correct" | "wrong" | "timeout";

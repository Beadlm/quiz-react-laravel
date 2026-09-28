# Culture Quiz — Front (React + TypeScript)

Front mobile-first pour l'application "Culture Quiz", consommant l'API Laravel
existante (back fourni séparément).

## Installation

```bash
npm install
cp .env.example .env
```

Le fichier `.env` contient l'URL de l'API :

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Adapte cette valeur si ton back Laravel tourne sur une autre adresse/port.

## Lancer en développement

```bash
npm run dev
```

L'app est servie sur http://localhost:5173. Le back Laravel doit être lancé
en parallèle (voir plus bas) pour que les catégories/questions se chargent.

## Build de production

```bash
npm run build
npm run preview
```

## Structure du projet

```
src/
  api/         appels fetch vers l'API Laravel (categories, questions)
  components/  briques UI réutilisables (Timer, AnswerButton, Logo, ...)
  pages/       une page par écran (Accueil, Catégories, Quiz, Résultat)
  types/       types TypeScript partagés (formes API + formes front)
  utils/       logique pure (mélange des réponses, construction du quiz)
  styles/      feuille de style globale (charte graphique mobile-first)
```

## Logique importante à connaître

- Le back ne fournit **pas** de filtre par catégorie sur `/api/questions` :
  le front récupère toutes les questions puis filtre côté client sur le nom
  de catégorie.
- Convention du back (visible dans son formulaire d'ajout de question) :
  **`reponse1` est toujours la bonne réponse**, `reponse2` à `reponse10` sont
  des propositions fausses. `utils/buildQuiz.ts` pioche 3 mauvaises réponses
  au hasard parmi elles, les mélange avec la bonne, et limite le quiz à 10
  questions choisies aléatoirement dans la catégorie.
- Le flux de navigation (catégorie → quiz → résultat) passe par le `state`
  de React Router (`useNavigate(..., { state })`). Si on arrive directement
  sur `/quiz` ou `/result` sans état (rechargement de page, lien direct),
  l'app redirige automatiquement vers l'écran précédent logique.

---

## Lancer le back Laravel fourni (back.zip)

Le back est une application **Laravel 8** (PHP 7.3/8.0 + MySQL). Voici le
mode de lancement classique en local :

1. **Dépendances PHP**
   ```bash
   composer install
   ```

2. **Fichier d'environnement**
   Le projet contient déjà un `.env` (sinon : `cp .env.example .env` puis
   `php artisan key:generate`). Il pointe vers une base MySQL nommée
   `culturequizz` :
   ```
   DB_CONNECTION=mysql
   DB_DATABASE=culturequizz
   DB_USERNAME=root
   DB_PASSWORD=root
   ```
   Adapte ces identifiants à ta configuration MySQL locale.

3. **Base de données** — deux options :
   - Importer le dump fourni (`culturequizz.sql`), qui recrée les tables :
     ```bash
     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS culturequizz"
     mysql -u root -p culturequizz < culturequizz.sql
     ```
   - Ou repartir des migrations Laravel (tables vides, à remplir ensuite via
     les écrans `/createcategorie` et `/createquestion`) :
     ```bash
     php artisan migrate
     ```

4. **Lancer le serveur**
   ```bash
   php artisan serve
   ```
   Par défaut, l'API est servie sur `http://127.0.0.1:8000`, avec les routes :
   - `GET /api/categories`
   - `GET /api/questions`
   - `GET/POST/PUT/DELETE /api/questions/{id}`

   Le CORS est déjà ouvert à toutes les origines (`config/cors.php`), donc le
   front React (sur un autre port) peut appeler l'API sans souci.

   Pour ajouter des catégories/questions via l'interface web fournie par le
   back (Blade) :
   - `http://127.0.0.1:8000/createcategorie`
   - `http://127.0.0.1:8000/createquestion`
   (le champ "Réponse 1" doit toujours contenir la bonne réponse).

5. **(Optionnel) Assets front du back** — non nécessaires pour l'API : les
   fichiers `package.json` / `webpack.mix.js` du back ne servent qu'aux vues
   Blade internes (`npm run dev` avec Laravel Mix), pas à l'app React.

## Lancer les deux ensembles

```bash
# Terminal 1 — back
cd back
php artisan serve

# Terminal 2 — front
cd culture-quiz-front
npm install
npm run dev
```

Puis ouvrir http://localhost:5173.

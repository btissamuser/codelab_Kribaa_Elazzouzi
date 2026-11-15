# CodeLab — apprendre HTML, CSS et JavaScript

Projet du module **Programmation Web 1 (TI504N)** — EFREI Paris, 2026-2027.

CodeLab est un site pour apprendre les bases du Web : des cours courts, des exemples de code
à copier, des zones interactives pour tester en direct et un quiz.

## Pages
| Page | Fichier | Contenu |
|------|---------|---------|
| Accueil | `index.html` | texte animé, carrousel, cartes de progression, compteurs animés |
| Cours HTML | `pages/html.html` | 6 leçons, tableau des balises, éditeur en direct |
| Cours CSS | `pages/css.html` | 6 leçons, simulateur du modèle de boîte, bac à sable Flexbox |
| Cours JavaScript | `pages/javascript.html` | 5 leçons, démo d'événement, console JS, éditeur HTML/CSS/JS |
| Quiz | `pages/quiz.html` | 15 questions chargées depuis `data/quiz.json` avec `fetch`, filtres, tableau des scores |
| À propos & contact | `pages/apropos.html` | équipe, répartition du travail, formulaire validé en JS |

## Technologies
- **HTML5** sémantique (header, nav, main, section, article, footer), formulaires et tableaux
- **CSS3** : variables, Grid, Flexbox, media queries (900px et 640px), animations `@keyframes`, thème sombre
- **JavaScript natif** (aucun framework ni bibliothèque) : DOM, événements, `fetch` + `async/await`,
  `try/catch`, `localStorage`, `IntersectionObserver`; scripts chargés avec `defer`

## Lancer le site
Ouvrir `index.html` dans un navigateur. Pour que le quiz charge le fichier JSON, il vaut mieux
passer par un petit serveur (sinon il utilise 3 questions de secours) :
- VS Code : extension *Live Server* → clic droit sur `index.html` → *Open with Live Server*
- ou dans un terminal : `python -m http.server` puis http://localhost:8000

## Validation
Toutes les pages HTML et la feuille CSS passent le validateur W3C (Nu Html Checker) sans erreur.

## Maquette
`maquette/maquette_CodeLab.pdf` : plan du site, charte graphique et wireframes (ordinateur + mobile).

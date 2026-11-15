# CodeLab — apprendre HTML, CSS et JavaScript

Projet du module **Programmation Web 1 (TI504N)** — EFREI Paris, 2026-2027 — groupe I1NEW2.

CodeLab est un site pour apprendre les bases du Web : des cours courts, des exemples de code
à copier, des zones interactives pour tester en direct et un quiz pour vérifier ses connaissances.

## Équipe
| Membre | Rôle principal |
|--------|----------------|
| Btissam KRIBAA | Maquette, structure commune, accueil, cours HTML et CSS, simulateurs CSS, responsive |
| Ayoub EL AZZOUZI | Cours JavaScript, console en direct, quiz (JSON + fetch), formulaire de contact |

## Dépôt Git
Lien du dépôt GitHub : voir `LIEN_GITHUB.txt`

## Arborescence
```
codelab/
├── index.html            → page d'accueil (niveau 0)
├── pages/                → pages principales (niveau 1)
│   ├── html.html
│   ├── css.html
│   ├── javascript.html
│   ├── quiz.html
│   └── apropos.html
├── css/style.css         → feuille de style unique
├── js/
│   ├── main.js           → commun à toutes les pages (menu, thème, animations…)
│   ├── home.js           → accueil (carrousel, compteurs, progression)
│   ├── playground.js     → zones interactives des cours
│   ├── quiz.js           → quiz
│   └── contact.js        → validation du formulaire
├── data/quiz.json        → questions du quiz
├── img/                  → logo et illustration (SVG)
└── maquette/             → maquette PDF + images PNG
```
Le site ne dépasse pas **2 niveaux** : accueil → page principale → section (ancre).

## Pages
| Page | Fichier | Contenu |
|------|---------|---------|
| Accueil | `index.html` | texte animé, carrousel, cartes de progression, compteurs animés |
| Cours HTML | `pages/html.html` | 6 leçons, tableau des balises, éditeur en direct |
| Cours CSS | `pages/css.html` | 6 leçons, simulateur du modèle de boîte, bac à sable Flexbox |
| Cours JavaScript | `pages/javascript.html` | 5 leçons, démo d'événement, console JS, éditeur HTML/CSS/JS |
| Quiz | `pages/quiz.html` | 15 questions chargées depuis `data/quiz.json`, filtres, tableau des scores |
| À propos & contact | `pages/apropos.html` | équipe, répartition du travail, formulaire validé en JS |

Toutes les pages ont le même **en-tête** (titre + barre de navigation) et le même **pied de page**
(navigation + lien vers « À propos »).

## Technologies
- **HTML5** sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`), formulaires et tableaux
- **CSS3** : variables, Grid, Flexbox, media queries (900px et 640px), animations `@keyframes`, thème sombre
- **JavaScript natif** (aucun framework ni bibliothèque) : DOM, événements, `fetch` + `async/await`,
  `try/catch`, `localStorage`, `IntersectionObserver` ; scripts chargés avec `defer`

## Fonctionnalités JavaScript
- Menu burger sur mobile et lien de la page active surligné
- Thème clair / sombre mémorisé
- Carrousel automatique (boutons, points, flèches du clavier, glisser sur mobile)
- Apparition des blocs au défilement, barre de progression de lecture, bouton « retour en haut »
- Bouton « Copier » sur les exemples de code
- Leçons à marquer comme terminées + progression affichée sur l'accueil
- Simulateurs CSS (modèle de boîte, Flexbox), console JavaScript et éditeurs en direct
- Quiz chargé en asynchrone, avec questions de secours si le fichier JSON est inaccessible
- Validation du formulaire de contact pendant la saisie et à l'envoi

## Lancer le site
Ouvrir `index.html` dans un navigateur. Pour que le quiz charge le fichier JSON, il vaut mieux
passer par un petit serveur (sinon il utilise 3 questions de secours) :
- VS Code : extension *Live Server* → clic droit sur `index.html` → *Open with Live Server*
- ou dans un terminal : `python -m http.server` puis http://localhost:8000

## Validation W3C
Toutes les pages HTML et la feuille CSS passent le validateur W3C sans erreur.

## Maquette
`maquette/maquette_CodeLab.pdf` (et les images `maquette_page1.png` à `maquette_page4.png`) :
plan du site, charte graphique et wireframes (ordinateur + mobile).

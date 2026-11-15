/* =========================================================
   CodeLab — Quiz
   Les questions sont chargées depuis data/quiz.json avec
   fetch() (asynchrone, async/await + try/catch).
   Si le fichier ne peut pas être lu (par exemple quand on
   ouvre la page en double-cliquant, en file://), on utilise
   une petite liste de secours pour que le quiz marche quand même.
   Les meilleurs scores sont gardés dans le localStorage
   et affichés dans un tableau.
   ========================================================= */

"use strict";

const FALLBACK_QUESTIONS = [
  { theme: "html", question: "Quelle balise sert à créer un lien ?", answers: ["<link>", "<a>", "<href>", "<url>"], correct: 1, explanation: "On utilise <a href=\"...\">." },
  { theme: "css", question: "Quelle propriété change la couleur du texte ?", answers: ["font-color", "text-color", "color", "background"], correct: 2, explanation: "C'est la propriété color." },
  { theme: "js", question: "Quel mot-clé déclare une constante ?", answers: ["var", "let", "const", "static"], correct: 2, explanation: "const empêche la réaffectation." }
];

const quiz = {
  all: [],        // toutes les questions
  list: [],       // questions de la partie en cours
  index: 0,
  score: 0,
  theme: "all"
};

const el = {
  status: document.querySelector("#quiz-status"),
  box: document.querySelector("#quiz-box"),
  progress: document.querySelector("#quiz-progress"),
  score: document.querySelector("#quiz-score"),
  question: document.querySelector("#quiz-question"),
  answers: document.querySelector("#quiz-answers"),
  explanation: document.querySelector("#quiz-explanation"),
  next: document.querySelector("#quiz-next"),
  result: document.querySelector("#quiz-result"),
  resultText: document.querySelector("#quiz-result-text"),
  restart: document.querySelector("#quiz-restart"),
  scoresBody: document.querySelector("#scores-body"),
  form: document.querySelector("#score-form"),
  pseudo: document.querySelector("#pseudo")
};

/* Chargement asynchrone des questions */
async function loadQuestions() {
  el.status.textContent = "Chargement des questions…";
  try {
    const response = await fetch("../data/quiz.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Fichier vide");
    quiz.all = data;
    el.status.textContent = data.length + " questions chargées.";
  } catch (error) {
    console.warn("Quiz : chargement du JSON impossible, questions de secours utilisées.", error);
    quiz.all = FALLBACK_QUESTIONS;
    el.status.textContent = "Mode hors-ligne : " + FALLBACK_QUESTIONS.length + " questions de secours.";
  }
}

/* Mélange un tableau (algorithme de Fisher-Yates) */
function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  const filtered = quiz.theme === "all" ? quiz.all : quiz.all.filter((q) => q.theme === quiz.theme);
  quiz.list = shuffle(filtered);
  quiz.index = 0;
  quiz.score = 0;
  el.result.classList.add("hidden");
  el.box.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const q = quiz.list[quiz.index];
  el.progress.textContent = "Question " + (quiz.index + 1) + " / " + quiz.list.length;
  el.score.textContent = "Score : " + quiz.score;
  el.question.textContent = q.question; // textContent : les balises comme <a> s'affichent en texte
  el.explanation.textContent = "";
  el.next.classList.add("hidden");
  el.answers.innerHTML = "";

  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = answer;
    btn.addEventListener("click", () => checkAnswer(i, btn));
    el.answers.appendChild(btn);
  });
}

function checkAnswer(choice, clicked) {
  const q = quiz.list[quiz.index];
  const buttons = el.answers.querySelectorAll(".answer");
  buttons.forEach((b) => (b.disabled = true));
  buttons[q.correct].classList.add("correct");

  if (choice === q.correct) {
    quiz.score++;
    el.explanation.textContent = "✅ Bonne réponse ! " + q.explanation;
  } else {
    clicked.classList.add("wrong");
    el.explanation.textContent = "❌ Raté. " + q.explanation;
  }
  el.score.textContent = "Score : " + quiz.score;
  el.next.textContent = quiz.index < quiz.list.length - 1 ? "Question suivante →" : "Voir mon résultat";
  el.next.classList.remove("hidden");
  el.next.focus();
}

function nextQuestion() {
  quiz.index++;
  if (quiz.index < quiz.list.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  el.box.classList.add("hidden");
  el.result.classList.remove("hidden");
  const percent = Math.round((quiz.score / quiz.list.length) * 100);
  let message = "Continue à t'entraîner, tu vas y arriver 💪";
  if (percent >= 80) message = "Excellent, tu maîtrises ! 🏆";
  else if (percent >= 50) message = "Pas mal du tout ! 👍";
  el.resultText.textContent = "Tu as " + quiz.score + " / " + quiz.list.length + " (" + percent + " %). " + message;
}

/* ---------- Tableau des scores ---------- */
function getScores() {
  try {
    return JSON.parse(localStorage.getItem("quiz-scores")) || [];
  } catch (e) {
    return [];
  }
}

function renderScores() {
  const scores = getScores();
  el.scoresBody.innerHTML = "";
  if (!scores.length) {
    const row = el.scoresBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = "Aucun score pour l'instant. À toi de jouer !";
    return;
  }
  scores.forEach((s, i) => {
    const row = el.scoresBody.insertRow();
    [i + 1, s.pseudo, s.theme, s.score].forEach((value) => {
      row.insertCell().textContent = value;
    });
  });
}

function saveScore(event) {
  event.preventDefault();
  const pseudo = el.pseudo.value.trim();
  if (pseudo.length < 2) {
    el.pseudo.classList.add("invalid");
    el.pseudo.focus();
    return;
  }
  el.pseudo.classList.remove("invalid");
  const labels = { all: "Tout", html: "HTML", css: "CSS", js: "JavaScript" };
  const scores = getScores();
  scores.push({ pseudo: pseudo, theme: labels[quiz.theme], score: quiz.score + " / " + quiz.list.length, value: quiz.score / quiz.list.length });
  scores.sort((a, b) => b.value - a.value);
  try {
    localStorage.setItem("quiz-scores", JSON.stringify(scores.slice(0, 10)));
  } catch (e) {
    /* stockage indisponible */
  }
  el.form.reset();
  renderScores();
}

/* ---------- Démarrage ---------- */
async function init() {
  try {
    await loadQuestions();
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        quiz.theme = btn.dataset.theme;
        startQuiz();
      });
    });
    el.next.addEventListener("click", nextQuestion);
    el.restart.addEventListener("click", startQuiz);
    el.form.addEventListener("submit", saveScore);
    document.querySelector("#clear-scores").addEventListener("click", () => {
      localStorage.removeItem("quiz-scores");
      renderScores();
    });
    renderScores();
    startQuiz();
  } catch (error) {
    console.error("Quiz : erreur au démarrage", error);
    el.status.textContent = "Le quiz n'a pas pu démarrer. Recharge la page.";
  }
}

init();

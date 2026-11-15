/* =========================================================
   CodeLab — script commun à toutes les pages
   Chargé avec l'attribut "defer" : il s'exécute une fois le
   HTML lu, donc il ne bloque pas l'affichage de la page.
   Chaque fonctionnalité est dans sa propre fonction et
   protégée par try/catch : si l'une plante, les autres
   continuent de marcher.
   ========================================================= */

"use strict";

/* Petite fonction utilitaire : lance une fonction sans faire planter le reste */
function safeRun(name, fn) {
  try {
    fn();
  } catch (error) {
    console.error("[CodeLab] Erreur dans « " + name + " » :", error);
  }
}

/* Lecture / écriture dans le localStorage (protégées, car il peut être désactivé) */
const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* stockage indisponible : on ignore */
    }
  }
};

/* Affiche une petite notification en bas de l'écran */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- 1. Menu burger (mobile) ---------- */
function initBurger() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.textContent = isOpen ? "✕" : "☰";
  });

  // On referme le menu quand on clique sur un lien
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.textContent = "☰";
    });
  });
}

/* ---------- 2. Lien actif dans la navigation ---------- */
function initActiveLink() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const target = link.getAttribute("href").split("/").pop();
    if (target === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- 3. Thème clair / sombre (mémorisé) ---------- */
function initTheme() {
  const btn = document.querySelector(".theme-toggle");
  if (store.get("theme", "light") === "dark") {
    document.body.classList.add("dark");
  }
  if (!btn) return;
  const updateIcon = () => {
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  };
  updateIcon();
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    store.set("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateIcon();
  });
}

/* ---------- 4. Apparition des blocs au défilement ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

/* ---------- 5. Barre de progression de lecture + bouton haut ---------- */
function initScrollUI() {
  const bar = document.querySelector(".read-progress");
  const toTop = document.querySelector(".to-top");

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = percent + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 400);
  });

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}

/* ---------- 6. Bouton « Copier » sur les blocs de code ---------- */
function initCopyButtons() {
  document.querySelectorAll(".code-block").forEach((block) => {
    const pre = block.querySelector("pre");
    if (!pre) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copier";
    block.appendChild(btn);

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = "Copié ✓";
      } catch (e) {
        btn.textContent = "Impossible";
      }
      setTimeout(() => (btn.textContent = "Copier"), 1500);
    });
  });
}

/* ---------- 7. Leçons « terminées » (pages de cours) ---------- */
function initLessons() {
  const page = document.body.dataset.course; // "html", "css" ou "js"
  if (!page) return;
  // seules les leçons qui ont un bouton « terminée » comptent
  const lessons = [...document.querySelectorAll(".lesson")].filter((l) => l.querySelector(".lesson-done"));
  const done = store.get("done-" + page, []);

  lessons.forEach((lesson) => {
    const btn = lesson.querySelector(".lesson-done");
    if (!btn) return;
    const id = lesson.id;
    const refresh = () => {
      const isDone = done.includes(id);
      btn.classList.toggle("done", isDone);
      btn.textContent = isDone ? "✓ Leçon terminée" : "Marquer comme terminée";
    };
    refresh();
    btn.addEventListener("click", () => {
      const index = done.indexOf(id);
      if (index === -1) {
        done.push(id);
        showToast("Bravo ! Leçon validée 🎉");
      } else {
        done.splice(index, 1);
      }
      store.set("done-" + page, done);
      store.set("total-" + page, lessons.length);
      refresh();
    });
  });
  store.set("total-" + page, lessons.length);
}

/* ---------- 8. Sommaire : surligne la section en cours ---------- */
function initToc() {
  const links = document.querySelectorAll(".toc a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.toggle("current", l.hash === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".lesson").forEach((s) => observer.observe(s));
}

/* ---------- 9. Année automatique dans le pied de page ---------- */
function initYear() {
  document.querySelectorAll(".year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* Lancement de tout le monde */
document.documentElement.classList.remove("no-js");
safeRun("menu burger", initBurger);
safeRun("lien actif", initActiveLink);
safeRun("thème", initTheme);
safeRun("apparition", initReveal);
safeRun("défilement", initScrollUI);
safeRun("copier", initCopyButtons);
safeRun("leçons", initLessons);
safeRun("sommaire", initToc);
safeRun("année", initYear);

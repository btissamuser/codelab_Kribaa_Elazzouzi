/* =========================================================
   CodeLab — scripts de la page d'accueil
   - texte qui s'écrit tout seul (effet machine à écrire)
   - carrousel (boutons, points, défilement auto, clavier, swipe)
   - compteurs animés
   - progression de l'utilisateur dans chaque cours
   ========================================================= */

"use strict";

/* ---------- Effet machine à écrire ---------- */
function initTyping() {
  const target = document.querySelector(".typed");
  if (!target) return;
  const words = ["HTML", "CSS", "JavaScript", "le Web"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);

    let delay = deleting ? 60 : 120;
    if (!deleting && charIndex === word.length) {
      delay = 1500; // pause quand le mot est complet
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- Carrousel ---------- */
function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  const track = carousel.querySelector(".slides");
  const slides = carousel.querySelectorAll(".slide");
  const dotsBox = carousel.querySelector(".dots");
  let current = 0;
  let timer = null;

  // Création des points (un par slide)
  slides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll("button");

  function goTo(index) {
    current = (index + slides.length) % slides.length; // boucle
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  carousel.querySelector(".prev").addEventListener("click", () => goTo(current - 1));
  carousel.querySelector(".next").addEventListener("click", () => goTo(current + 1));

  // Pause quand la souris est dessus
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restart);

  // Flèches du clavier
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // Glisser du doigt sur mobile
  let startX = 0;
  carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
  });

  goTo(0);
}

/* ---------- Compteurs animés (quand ils apparaissent à l'écran) ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const end = Number(el.dataset.count);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * end);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = end + (el.dataset.suffix || "");
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => observer.observe(c));
}

/* ---------- Progression dans chaque cours (lue dans le localStorage) ---------- */
function initProgress() {
  document.querySelectorAll("[data-progress]").forEach((card) => {
    const course = card.dataset.progress;
    let done = [];
    let total = 0;
    try {
      done = JSON.parse(localStorage.getItem("done-" + course)) || [];
      total = JSON.parse(localStorage.getItem("total-" + course)) || 0;
    } catch (e) {
      /* rien de sauvegardé */
    }
    const percent = total ? Math.round((done.length / total) * 100) : 0;
    card.querySelector(".progress-bar span").style.width = percent + "%";
    card.querySelector(".progress-label").textContent = percent + " % terminé";
  });
}

[initTyping, initCarousel, initCounters, initProgress].forEach((fn) => {
  try {
    fn();
  } catch (error) {
    console.error("[CodeLab accueil]", fn.name, error);
  }
});

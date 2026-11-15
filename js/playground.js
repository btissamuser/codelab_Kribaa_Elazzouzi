/* =========================================================
   CodeLab — zones interactives des pages de cours
   - simulateur du modèle de boîte CSS (curseurs)
   - bac à sable Flexbox (listes déroulantes)
   - éditeur de code en direct (HTML/CSS/JS dans une iframe)
   - mini-console JavaScript
   ========================================================= */

"use strict";

/* ---------- Modèle de boîte (box model) ---------- */
function initBoxModel() {
  const box = document.querySelector(".demo-box");
  if (!box) return;
  const inputs = document.querySelectorAll("[data-box]");
  const output = document.querySelector("#box-css");

  function update() {
    const values = {};
    inputs.forEach((input) => {
      values[input.dataset.box] = input.value;
      const label = document.querySelector("#val-" + input.dataset.box);
      if (label) label.textContent = input.value + "px";
    });
    box.style.width = values.width + "px";
    box.style.padding = values.padding + "px";
    box.style.borderWidth = values.border + "px";
    box.style.margin = values.margin + "px";
    box.style.borderRadius = values.radius + "px";

    const total = Number(values.width) + 2 * Number(values.padding) + 2 * Number(values.border);
    output.textContent =
      ".boite {\n" +
      "  width: " + values.width + "px;\n" +
      "  padding: " + values.padding + "px;\n" +
      "  border: " + values.border + "px solid;\n" +
      "  margin: " + values.margin + "px;\n" +
      "  border-radius: " + values.radius + "px;\n" +
      "}\n/* Largeur visible : " + total + "px (content-box) */";
  }
  inputs.forEach((input) => input.addEventListener("input", update));
  update();
}

/* ---------- Bac à sable Flexbox ---------- */
function initFlexbox() {
  const demo = document.querySelector(".flex-demo");
  if (!demo) return;
  const selects = document.querySelectorAll("[data-flex]");
  const output = document.querySelector("#flex-css");

  function update() {
    let css = ".conteneur {\n  display: flex;\n";
    selects.forEach((select) => {
      demo.style[select.dataset.flex] = select.value;
      const prop = select.dataset.flex.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      css += "  " + prop + ": " + select.value + ";\n";
    });
    output.textContent = css + "}";
  }
  selects.forEach((s) => s.addEventListener("change", update));
  update();
}

/* ---------- Éditeur en direct ---------- */
function initLiveEditors() {
  document.querySelectorAll(".live-editor").forEach((editor) => {
    const textarea = editor.querySelector("textarea");
    const frame = editor.querySelector("iframe");
    let timer;
    const render = () => {
      frame.srcdoc = textarea.value;
    };
    textarea.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(render, 300); // on attend que l'utilisateur arrête de taper
    });
    // La touche Tab insère deux espaces au lieu de quitter le champ
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const pos = textarea.selectionStart;
        textarea.value = textarea.value.slice(0, pos) + "  " + textarea.value.slice(textarea.selectionEnd);
        textarea.selectionStart = textarea.selectionEnd = pos + 2;
      }
    });
    const reset = editor.parentElement.querySelector(".reset-editor");
    if (reset) {
      const original = textarea.value;
      reset.addEventListener("click", () => {
        textarea.value = original;
        render();
      });
    }
    render();
  });
}

/* ---------- Mini-console JavaScript ---------- */
function initConsole() {
  const runBtn = document.querySelector("#run-js");
  if (!runBtn) return;
  const input = document.querySelector("#js-input");
  const out = document.querySelector("#js-output");

  runBtn.addEventListener("click", () => {
    const lines = [];
    // On remplace temporairement console.log pour récupérer l'affichage
    const fakeConsole = {
      log: (...args) => lines.push(args.map(format).join(" "))
    };
    try {
      // new Function crée une fonction à partir du texte saisi
      const run = new Function("console", input.value);
      const result = run(fakeConsole);
      if (result !== undefined) lines.push("← " + format(result));
      out.textContent = lines.join("\n") || "(aucun affichage — utilise console.log)";
      out.style.color = "#7CFC00";
    } catch (error) {
      out.textContent = "❌ " + error.name + " : " + error.message;
      out.style.color = "#ff6b6b";
    }
  });

  function format(value) {
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return String(value);
      }
    }
    return String(value);
  }
}

/* ---------- Démo événements : bouton compteur ---------- */
function initEventDemo() {
  const btn = document.querySelector("#demo-click");
  if (!btn) return;
  let clicks = 0;
  btn.addEventListener("click", () => {
    clicks++;
    document.querySelector("#demo-count").textContent = clicks;
    btn.style.transform = "scale(" + (1 + Math.min(clicks, 10) * 0.03) + ")";
  });
}

[initBoxModel, initFlexbox, initLiveEditors, initConsole, initEventDemo].forEach((fn) => {
  try {
    fn();
  } catch (error) {
    console.error("[CodeLab playground]", fn.name, error);
  }
});

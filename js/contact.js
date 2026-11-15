/* =========================================================
   CodeLab — validation du formulaire de contact
   Chaque champ est vérifié pendant la saisie et à l'envoi.
   Les messages d'erreur s'affichent sous le champ.
   ========================================================= */

"use strict";

(function () {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const success = document.querySelector("#form-success");
  const counter = document.querySelector("#message-count");

  // Une règle de validation par champ : renvoie un message d'erreur ou ""
  const rules = {
    nom: (v) => (v.trim().length < 2 ? "Ton nom doit faire au moins 2 caractères." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) ? "" : "Adresse e-mail invalide (ex : prenom@mail.com)."),
    sujet: (v) => (v === "" ? "Choisis un sujet." : ""),
    niveau: () => (form.querySelector("input[name='niveau']:checked") ? "" : "Indique ton niveau."),
    message: (v) => (v.trim().length < 20 ? "Ton message doit faire au moins 20 caractères." : ""),
    rgpd: () => (form.querySelector("#rgpd").checked ? "" : "Tu dois accepter pour envoyer le message.")
  };

  function validateField(name) {
    const field = form.elements[name];
    const value = field.value !== undefined ? field.value : "";
    const message = rules[name](value);
    const errorBox = document.querySelector("#error-" + name);
    if (errorBox) errorBox.textContent = message;

    // Couleur de la bordure (pas pour les boutons radio)
    if (field instanceof HTMLElement && field.type !== "checkbox") {
      field.classList.toggle("invalid", message !== "");
      field.classList.toggle("valid", message === "");
      field.setAttribute("aria-invalid", String(message !== ""));
    }
    return message === "";
  }

  // Vérification pendant la saisie
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    const events = name === "niveau" || name === "rgpd" || name === "sujet" ? "change" : "input";
    if (field instanceof RadioNodeList) {
      field.forEach((radio) => radio.addEventListener(events, () => validateField(name)));
    } else {
      field.addEventListener(events, () => validateField(name));
    }
  });

  // Compteur de caractères du message
  form.elements.message.addEventListener("input", (e) => {
    counter.textContent = e.target.value.length + " / 500";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // pas de serveur : on simule l'envoi
    const results = Object.keys(rules).map(validateField);
    if (results.every(Boolean)) {
      const prenom = form.elements.nom.value.trim().split(" ")[0];
      success.textContent = "Merci " + prenom + " ! Ton message a bien été envoyé. Réponse sous 48 h. ✉️";
      success.classList.add("show");
      form.reset();
      form.querySelectorAll(".valid").forEach((f) => f.classList.remove("valid"));
      counter.textContent = "0 / 500";
    } else {
      success.classList.remove("show");
      const firstError = form.querySelector(".invalid") || form.querySelector("#rgpd");
      if (firstError) firstError.focus();
    }
  });
})();

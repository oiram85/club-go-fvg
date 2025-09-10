// Carica la navbar dal partial
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar");
  if (navbarContainer) {
    fetch("partials/navbar.html")
      .then((res) => res.text())
      .then((html) => {
        navbarContainer.innerHTML = html;

        // Dopo che la navbar è stata caricata, attivo l'hamburger
        const nav = navbarContainer.querySelector(".nav");
        const hamburger = navbarContainer.querySelector(".hamburger");
        hamburger.addEventListener("click", () => {
          nav.classList.toggle("open");
          const expanded =
            hamburger.getAttribute("aria-expanded") === "true" || false;
          hamburger.setAttribute("aria-expanded", !expanded);
        });
      })
      .catch((err) => console.error("Errore caricamento navbar:", err));
  }
});

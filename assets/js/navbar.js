// assets/js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const loadNavbar = async () => {
    const container = document.getElementById("navbar");
    if (!container) return;

    try {
      // usa percorso relativo per essere sicuri su GH Pages
      const res = await fetch("./partials/navbar.html");
      if (!res.ok) throw new Error("partials/navbar.html non trovato");
      container.innerHTML = await res.text();

      // inizializza comportamento del menu dopo l'inserimento
      initNavbarBehavior(container);
    } catch (err) {
      console.warn("Impossibile caricare navbar partial:", err);
      // se non esiste partial, cerca navbar già statica nella pagina
      initNavbarBehavior(document);
    }
  };

  const initNavbarBehavior = (root) => {
    const nav = root.querySelector(".nav");
    const hamburger = root.querySelector(".hamburger");
    const navLinks = root.querySelector(".nav-links");

    // toggle hamburger (se presente)
    if (hamburger && nav) {
      hamburger.addEventListener("click", () => {
        nav.classList.toggle("open");
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", (!expanded).toString());
      });
    }

    // chiudi menu quando si clicca su un link (utile su mobile)
    if (navLinks && nav) {
      navLinks.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          nav.classList.remove("open");
          if (hamburger) hamburger.setAttribute("aria-expanded", "false");
        });
      });
    }

    // smooth-scroll con offset per ancore (evita mappa sotto navbar)
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 64;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const top =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  };

  loadNavbar();
});

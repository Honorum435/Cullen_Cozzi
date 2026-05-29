import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initReveals } from "../animations/reveals";
import { initParallax } from "../animations/parallax";
import { prefersReducedMotion } from "../motion";

function initDossierIndex(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".dossier__index a")
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(".dossier__chapter")
  );

  if (!links.length || !sections.length) return;

  if (prefersReducedMotion()) {
    return;
  }

  sections.forEach((sec) => {
    const id = sec.getAttribute("id");
    if (!id) return;
    const link = links.find((l) => l.getAttribute("href") === `#${id}`);
    if (!link) return;

    ScrollTrigger.create({
      trigger: sec,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        links.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      },
      onEnterBack: () => {
        links.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      },
    });
  });

  // Smooth scroll on index click respect Lenis
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href")?.replace("#", "");
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
}

export function initEstudio(): void {
  initReveals();
  initParallax();
  initDossierIndex();
}

import { gsap } from "gsap";
import { prefersReducedMotion } from "./motion";

/** Marca el body como cargado para el fade inicial. */
export function initPageLoad(): void {
  // Evita FOUC: dispara fade-in en el siguiente frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });
  });
}

/** Cursor custom — disco fino que sigue mouse, expande en links/botones.
 *  Solo corre rAF mientras el cursor se mueve; se duerme al estar idle. */
export function initCursor(): void {
  if (prefersReducedMotion()) return;
  if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.appendChild(cursor);
  document.body.classList.add("has-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;
  let rafId = 0;
  let isRunning = false;

  gsap.set(cursor, { x: posX, y: posY });

  const updatePos = (): void => {
    const dx = mouseX - posX;
    const dy = mouseY - posY;
    posX += dx * 0.2;
    posY += dy * 0.2;
    gsap.set(cursor, { x: posX, y: posY });

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      // Cerca del target — dormir
      isRunning = false;
      return;
    }
    rafId = requestAnimationFrame(updatePos);
  };

  const wake = (): void => {
    if (isRunning) return;
    isRunning = true;
    rafId = requestAnimationFrame(updatePos);
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.add("is-ready");
      wake();
    },
    { passive: true }
  );

  // Hover en elementos interactivos
  const hoverables = "a, button, [data-cursor='hover']";
  document.addEventListener("mouseover", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(hoverables)) cursor.classList.add("is-hover");
  });
  document.addEventListener("mouseout", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(hoverables)) cursor.classList.remove("is-hover");
  });

  // Limpiar si la página se descarga
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
  });
}

/** Magnetic effect — botones se atraen suavemente al cursor cerca. */
export function initMagnetic(): void {
  if (prefersReducedMotion()) return;
  if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

  const magnets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  magnets.forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.25;
    const radius = 90;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) return;
      const factor = (1 - dist / radius) * strength;
      gsap.to(el, {
        x: dx * factor,
        y: dy * factor,
        duration: 0.4,
        ease: "power3.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
}

/** Card tilt 3D leve siguiendo el mouse. */
export function initTilt(): void {
  if (prefersReducedMotion()) return;
  if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

  const tilters = document.querySelectorAll<HTMLElement>(".tilt");
  tilters.forEach((el) => {
    el.style.perspective = "1000px";
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotationX: -y * 4,
        rotationY: x * 4,
        duration: 0.5,
        ease: "power3.out",
        transformPerspective: 1000,
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  });
}

/** Image clip reveal — al entrar en viewport, las imágenes con .img-reveal se abren. */
export function initImageReveals(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll<HTMLElement>(".img-reveal").forEach((el) => {
    if (prefersReducedMotion()) {
      el.classList.add("is-visible");
    } else {
      observer.observe(el);
    }
  });
}

/** Nav links: split each char into spans para hover por letra. */
export function initNavLetterSplit(): void {
  document
    .querySelectorAll<HTMLElement>(".nav-link")
    .forEach((link) => {
      if (link.dataset.split === "true") return;
      const text = link.textContent?.trim() ?? "";
      const span = document.createElement("span");
      span.className = "nav-link__letters";
      [...text].forEach((ch) => {
        const letter = document.createElement("span");
        letter.className = "nav-link__letter";
        letter.textContent = ch === " " ? " " : ch;
        span.appendChild(letter);
      });
      link.textContent = "";
      link.appendChild(span);
      link.dataset.split = "true";
    });
}

export function initLife(): void {
  initPageLoad();
  initCursor();
  initMagnetic();
  initTilt();
  initImageReveals();
  initNavLetterSplit();
}

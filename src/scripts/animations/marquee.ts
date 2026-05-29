import { gsap } from "gsap";
import { prefersReducedMotion } from "../motion";

/**
 * Marquee infinito horizontal. Duplica el contenido de .marquee-track y lo desplaza
 * con un loop GSAP usando un modifier para wrap, sin saltos al reiniciar.
 */
export function initMarquees(): void {
  const tracks = document.querySelectorAll<HTMLElement>(".marquee-track");

  tracks.forEach((track) => {
    // Duplicar contenido al menos una vez para loop seamless
    const children = Array.from(track.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    if (prefersReducedMotion()) return;

    const speed = Number(track.dataset.speed ?? 50); // px per second
    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    const tween = gsap.to(track, {
      x: `-=${totalWidth}`,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          const n = parseFloat(x);
          const mod = ((n % totalWidth) + totalWidth) % totalWidth;
          return `${-mod}px`;
        },
      },
    });

    // Pausa al hover
    const marquee = track.closest<HTMLElement>(".marquee");
    marquee?.addEventListener("mouseenter", () => tween.timeScale(0.2));
    marquee?.addEventListener("mouseleave", () => tween.timeScale(1));
  });
}

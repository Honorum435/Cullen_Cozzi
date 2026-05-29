import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../motion";

export function initParallax(): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.2;
    gsap.fromTo(
      el,
      { yPercent: -speed * 30 },
      {
        yPercent: speed * 30,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

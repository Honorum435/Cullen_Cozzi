import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance: Lenis | null = null;

export function initMotion(): void {
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion()) {
    return;
  }

  lenisInstance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Default GSAP eases
  gsap.defaults({
    ease: "expo.out",
    duration: 1.1,
  });

  // Refresh ScrollTrigger on resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Scroll-linked theme shift: muta el tema cream→ink en ventanas de scroll.
 * Recibe un elemento .theme-trigger; al entrar activa body.theme-ink.
 */
export function initThemeShifts(): void {
  if (prefersReducedMotion()) return;

  const triggers = document.querySelectorAll<HTMLElement>("[data-theme-shift]");
  triggers.forEach((trigger) => {
    const targetTheme = trigger.dataset.themeShift || "ink";
    ScrollTrigger.create({
      trigger,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => document.body.classList.add(`theme-${targetTheme}`),
      onLeave: () => document.body.classList.remove(`theme-${targetTheme}`),
      onEnterBack: () => document.body.classList.add(`theme-${targetTheme}`),
      onLeaveBack: () => document.body.classList.remove(`theme-${targetTheme}`),
    });
  });
}

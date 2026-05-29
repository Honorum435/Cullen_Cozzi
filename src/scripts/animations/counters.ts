import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../motion";

export function initCounters(): void {
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const target = Number(el.dataset.counter || 0);
    const decimals = Number(el.dataset.decimals || 0);

    if (prefersReducedMotion()) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration: 1.8,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = obj.value.toFixed(decimals);
      },
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });
}

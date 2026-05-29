import { initReveals } from "../animations/reveals";
import { initMarquees } from "../animations/marquee";
import { initParallax } from "../animations/parallax";
import { initThemeShifts } from "../motion";

export function initHome(): void {
  initReveals();
  initMarquees();
  initParallax();
  initThemeShifts();
}

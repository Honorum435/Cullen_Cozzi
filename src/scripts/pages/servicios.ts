import { initReveals } from "../animations/reveals";

function initServiceList(): void {
  const items = document.querySelectorAll<HTMLElement>(".service-item");
  items.forEach((item) => {
    const title = item.querySelector(".service-item__title");
    title?.addEventListener("click", () => {
      items.forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
      item.classList.toggle("is-open");
    });
  });
}

export function initServicios(): void {
  initReveals();
  initServiceList();
}

export function initNav(): void {
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector<HTMLElement>(".nav");
  const header = document.querySelector<HTMLElement>(".site-header");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("is-open");
    nav?.classList.toggle("is-open");
    document.body.style.overflow = nav?.classList.contains("is-open")
      ? "hidden"
      : "";
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("is-open");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  // Active nav link
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPage = href.replace("./", "").replace("/", "");
    const isActive =
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html");
    link.classList.toggle("is-active", isActive);
  });

  // Header scroll state
  let lastY = 0;
  const onScroll = (): void => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 30);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

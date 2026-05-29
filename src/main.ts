import "../styles.css";
import { initNav } from "./scripts/nav";
import { initMotion } from "./scripts/motion";
import { initLife } from "./scripts/life";

type Page = "home" | "estudio" | "servicios" | "blog" | "contacto";

async function bootstrap(): Promise<void> {
  initMotion();
  initNav();
  initLife();

  const page = (document.body.dataset.page as Page | undefined) ?? "home";

  switch (page) {
    case "home": {
      const { initHome } = await import("./scripts/pages/home");
      initHome();
      break;
    }
    case "estudio": {
      const { initEstudio } = await import("./scripts/pages/estudio");
      initEstudio();
      break;
    }
    case "servicios": {
      const { initServicios } = await import("./scripts/pages/servicios");
      initServicios();
      break;
    }
    case "blog": {
      const { initBlog } = await import("./scripts/pages/blog");
      initBlog();
      break;
    }
    case "contacto": {
      const { initContacto } = await import("./scripts/pages/contacto");
      initContacto();
      break;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void bootstrap());
} else {
  void bootstrap();
}

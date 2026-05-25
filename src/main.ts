// Hamburger menu
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu?.classList.toggle("open");
});

// Nav activo según página actual (por URL)
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll<HTMLAnchorElement>("nav ul a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const linkPage = href.replace("./", "");
  const isActive =
    linkPage === currentPage ||
    (currentPage === "" && linkPage === "index.html");
  link.classList.toggle("active", isActive);
});

// Animaciones al hacer scroll
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-animate]").forEach((el) => animateObserver.observe(el));

// Formulario de contacto
// Para activar envío real: creá una cuenta en https://formspree.io y reemplazá YOUR_FORM_ID
const FORMSPREE_ID = "YOUR_FORM_ID";

const form = document.getElementById("contactForm") as HTMLFormElement | null;
const formMessage = document.getElementById("formMessage") as HTMLDivElement | null;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = (document.getElementById("nombre") as HTMLInputElement).value.trim();
  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const mensaje = (document.getElementById("mensaje") as HTMLTextAreaElement).value.trim();

  if (!nombre || !email || !mensaje) {
    showMessage("Por favor completá todos los campos obligatorios.", "error");
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']") as HTMLButtonElement;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  if (FORMSPREE_ID === "YOUR_FORM_ID") {
    setTimeout(() => {
      showMessage(`¡Gracias ${nombre}! Tu mensaje fue enviado correctamente.`, "success");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar";
    }, 800);
    return;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        telefono: (document.getElementById("telefono") as HTMLInputElement).value.trim(),
        asunto: (document.getElementById("asunto") as HTMLInputElement).value.trim(),
        mensaje,
      }),
    });
    if (response.ok) {
      showMessage(`¡Gracias ${nombre}! Tu mensaje fue enviado correctamente.`, "success");
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    showMessage("Hubo un error al enviar. Por favor intentá nuevamente.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
  }
});

function showMessage(text: string, type: "success" | "error"): void {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.hidden = false;
  setTimeout(() => {
    formMessage.hidden = true;
  }, 5000);
}

// Efecto header al hacer scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
});

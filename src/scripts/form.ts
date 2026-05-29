const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "YOUR_FORM_ID";

function showMessage(
  el: HTMLDivElement,
  text: string,
  type: "success" | "error"
): void {
  el.textContent = text;
  el.className = `form-message ${type}`;
  el.hidden = false;
  window.setTimeout(() => {
    el.hidden = true;
  }, 5000);
}

export function initForm(): void {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  const formMessage = document.getElementById(
    "formMessage"
  ) as HTMLDivElement | null;

  if (!form || !formMessage) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreInput = document.getElementById("nombre") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const mensajeInput = document.getElementById(
      "mensaje"
    ) as HTMLTextAreaElement;
    const telefonoInput = document.getElementById(
      "telefono"
    ) as HTMLInputElement | null;
    const asuntoInput = document.getElementById(
      "asunto"
    ) as HTMLInputElement | null;

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    if (!nombre || !email || !mensaje) {
      showMessage(
        formMessage,
        "Por favor completá los campos obligatorios.",
        "error"
      );
      return;
    }

    const submitBtn = form.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    if (FORMSPREE_ID === "YOUR_FORM_ID") {
      window.setTimeout(() => {
        showMessage(
          formMessage,
          `Gracias ${nombre}. Tu mensaje fue enviado correctamente.`,
          "success"
        );
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }, 800);
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono: telefonoInput?.value.trim() ?? "",
          asunto: asuntoInput?.value.trim() ?? "",
          mensaje,
        }),
      });
      if (response.ok) {
        showMessage(
          formMessage,
          `Gracias ${nombre}. Tu mensaje fue enviado correctamente.`,
          "success"
        );
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      showMessage(
        formMessage,
        "Hubo un error al enviar. Intentá nuevamente.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

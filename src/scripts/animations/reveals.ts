import { prefersReducedMotion } from "../motion";

/**
 * Split-text reveal por palabras. Toma un h1/h2 con clase .split-words y
 * wrappea cada palabra en <span class="reveal-mask"><span class="reveal-mask-inner">word</span></span>.
 * Luego un IntersectionObserver dispara la cascade con stagger via --delay.
 */
const segmenter =
  "Segmenter" in Intl
    ? new Intl.Segmenter("es", { granularity: "word" })
    : null;

const PUNCT = /^[.,;:!?¿¡"'»«)\]…—–-]+$/;

function wrapTextNode(text: string, baseDelay: number, step: number, startIdx: number): { nodes: Node[]; nextIdx: number } {
  const rawTokens = segmenter
    ? Array.from(segmenter.segment(text)).map((s) => s.segment)
    : text.split(/(\s+)/);

  // Merge trailing punctuation with the previous word so it doesn't wrap.
  const tokens: string[] = [];
  rawTokens.forEach((tok) => {
    if (!tok) return;
    if (PUNCT.test(tok) && tokens.length > 0 && !/^\s+$/.test(tokens[tokens.length - 1])) {
      tokens[tokens.length - 1] += tok;
    } else {
      tokens.push(tok);
    }
  });

  const nodes: Node[] = [];
  let i = startIdx;
  tokens.forEach((token) => {
    if (!token) return;
    if (/^\s+$/.test(token)) {
      nodes.push(document.createTextNode(token));
      return;
    }
    const mask = document.createElement("span");
    mask.className = "reveal-mask";
    mask.style.setProperty("--delay", `${baseDelay + i * step}ms`);
    const inner = document.createElement("span");
    inner.className = "reveal-mask-inner";
    inner.textContent = token;
    mask.appendChild(inner);
    nodes.push(mask);
    i += 1;
  });
  return { nodes, nextIdx: i };
}

function splitToWords(el: HTMLElement, baseDelay = 0, step = 60): void {
  if (el.dataset.split === "true") return;
  el.dataset.split = "true";

  let idx = 0;
  const processNode = (node: Node): Node[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const { nodes, nextIdx } = wrapTextNode(text, baseDelay, step, idx);
      idx = nextIdx;
      return nodes;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const src = node as HTMLElement;
      const clone = src.cloneNode(false) as HTMLElement;
      Array.from(src.childNodes).forEach((child) => {
        processNode(child).forEach((n) => clone.appendChild(n));
      });
      return [clone];
    }
    return [];
  };

  const result: Node[] = [];
  Array.from(el.childNodes).forEach((child) => {
    processNode(child).forEach((n) => result.push(n));
  });

  el.innerHTML = "";
  result.forEach((n) => el.appendChild(n));
}

export function initReveals(): void {
  const reduced = prefersReducedMotion();

  // Split-word headings
  document.querySelectorAll<HTMLElement>(".split-words").forEach((el) => {
    const baseDelay = Number(el.dataset.delay ?? 0);
    const step = Number(el.dataset.step ?? 60);
    splitToWords(el, baseDelay, step);
  });

  // Reveal observer for mask containers — fires masks within them
  const maskObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target
            .querySelectorAll<HTMLElement>(".reveal-mask")
            .forEach((m) => m.classList.add("is-visible"));
          maskObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  // 1) Containers explicitly marked as .split-words
  document.querySelectorAll(".split-words").forEach((el) => {
    if (reduced) {
      el.querySelectorAll<HTMLElement>(".reveal-mask").forEach((m) =>
        m.classList.add("is-visible")
      );
    } else {
      maskObserver.observe(el);
    }
  });

  // 2) Pre-baked reveal-masks (e.g. hero) — group by closest non-split-words ancestor
  const orphanMasks = Array.from(
    document.querySelectorAll<HTMLElement>(".reveal-mask")
  ).filter((m) => !m.closest(".split-words"));
  const orphanGroups = new Set<HTMLElement>();
  orphanMasks.forEach((m) => {
    const group = (m.closest("h1, h2, h3, p") || m.parentElement) as HTMLElement | null;
    if (group) orphanGroups.add(group);
  });
  orphanGroups.forEach((g) => {
    if (reduced) {
      g.querySelectorAll<HTMLElement>(".reveal-mask").forEach((m) =>
        m.classList.add("is-visible")
      );
    } else {
      maskObserver.observe(g);
    }
  });

  // Generic fade-up / fade-in observer
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document
    .querySelectorAll<HTMLElement>(".fade-up, .fade-in")
    .forEach((el) => {
      if (reduced) {
        el.classList.add("is-visible");
      } else {
        fadeObserver.observe(el);
      }
    });
}

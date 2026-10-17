// Único módulo de efectos. Todo es mejora progresiva: si algo falla, el
// contenido sigue visible porque la clase `js` sólo se agrega al final.

const reducido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function entradaSecciones() {
  const els = document.querySelectorAll<HTMLElement>(".revelar");
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}

function conteo() {
  const els = document.querySelectorAll<HTMLElement>("[data-valor]");
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const final = Number(el.dataset.valor);
      const dec = Number(el.dataset.decimales ?? 0);
      const fmt = (n: number) =>
        n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (reducido() || !Number.isFinite(final)) continue;
      const dur = 500;
      const t0 = performance.now();
      const paso = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(final * ease);
        if (p < 1) requestAnimationFrame(paso);
        else el.textContent = fmt(final);
      };
      requestAnimationFrame(paso);
    }
  });
  els.forEach((el) => io.observe(el));
}

function progreso() {
  const barra = document.querySelector<HTMLElement>(".progreso");
  if (!barra) return;
  const act = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    barra.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
  };
  window.addEventListener("scroll", act, { passive: true });
  act();
}

function indiceActivo() {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>(".indice a[href^='#']").forEach((a) =>
    links.set(a.getAttribute("href")!.slice(1), a),
  );
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute("aria-current"));
        links.get(e.target.id)?.setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "-30% 0px -65% 0px" },
  );
  links.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

function figuras() {
  document.querySelectorAll<HTMLImageElement>(".figura-marco img").forEach((img) => {
    const marco = img.parentElement!;
    img.addEventListener("load", () => marco.classList.add("cargada"), { once: true });
    img.addEventListener("error", () => marco.classList.add("falta"), { once: true });
    if (img.complete) {
      if (img.naturalWidth === 0) marco.classList.add("falta");
      else marco.classList.add("cargada");
    }
  });
}

function lightbox() {
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Figura ampliada");
  dlg.innerHTML =
    '<button type="button" class="lightbox-cerrar" aria-label="Cerrar figura">Cerrar ✕</button><img alt="" />';
  document.body.appendChild(dlg);
  const img = dlg.querySelector("img")!;
  const btn = dlg.querySelector("button")!;
  let origen: HTMLElement | null = null;

  btn.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener("close", () => origen?.focus());

  document.querySelectorAll<HTMLButtonElement>(".figura-abrir").forEach((b) => {
    b.addEventListener("click", () => {
      const fig = b.querySelector("img");
      if (!fig || b.parentElement?.classList.contains("falta")) return;
      origen = b;
      img.src = fig.currentSrc || fig.src;
      img.alt = fig.alt;
      dlg.showModal();
      btn.focus();
    });
  });
}

let iniciado = false;
export function iniciarEfectos() {
  if (iniciado || typeof window === "undefined") return;
  iniciado = true;
  try {
    if (!("IntersectionObserver" in window)) return;
    figuras();
    lightbox();
    progreso();
    indiceActivo();
    entradaSecciones();
    conteo();
    document.documentElement.classList.add("js");
  } catch (err) {
    console.error("Efectos desactivados:", err);
    document.documentElement.classList.remove("js");
  }
}

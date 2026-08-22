/* ==========================================================================
   aquamoon — Comportamiento compartido
   ========================================================================== */

const NAV_ITEMS = [
  { href: "index.html", label: "Inicio" },
  { href: "consultas.html", label: "Consultas" },
  { href: "tienda.html", label: "Tienda", hidden: true },
  { href: "sobre-mi.html", label: "Sobre mí" },
  { href: "blog.html", label: "Blog" },
  { href: "faq.html", label: "FAQ" },
  { href: "contacto.html", label: "Contacto" },
];

function currentPage() {
  const p = window.location.pathname.split("/").pop() || "index.html";
  return p;
}

function basePrefix() {
  return window.location.pathname.includes("/legal/") ? "../" : "";
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const here = currentPage();
  const base = basePrefix();
  const links = NAV_ITEMS.filter(item => !item.hidden).map(item => {
    const active = (item.href === here) || (here === "" && item.href === "index.html");
    return `<a href="${base}${item.href}"${active ? ' class="active" aria-current="page"' : ''}>${item.label}</a>`;
  }).join("");

  mount.innerHTML = `
    <div class="nav-wrap">
      <a href="${base}index.html" class="brand">${SITE.brandName}</a>
      <nav class="nav-links" id="navLinks" aria-label="Navegación principal">
        ${links}
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.classList.add("site-footer");
  const base = basePrefix();
  mount.innerHTML = `
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} ${SITE.brandName}.</span>
      <!-- <a href="${base}legal/aviso-legal.html">Aviso legal</a> deshabilitado temporalmente, pendiente de redactar -->
    </div>
  `;
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => obs.observe(el));
}

function initStickyCta() {
  const bar = document.getElementById("stickyCta");
  const hero = document.querySelector(".hero, .page-hero");
  if (!bar || !hero) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      bar.classList.toggle("show", !entry.isIntersecting);
    });
  }, { threshold: 0 });
  obs.observe(hero);
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(i => {
        if (i !== item) { i.classList.remove("open"); i.querySelector(".faq-q").setAttribute("aria-expanded", "false"); }
      });
      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initReveal();
  initStickyCta();
  initFaqAccordion();
});

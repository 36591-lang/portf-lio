/* ============================================================
   GIOVANNI GODOY — PORTFÓLIO · script.js
   ============================================================ */

'use strict';

/* ─── Respeita preferência de redução de movimento ──────────── */
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ─── Atualiza o ano no rodapé ───────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Navbar: fundo ao rolar ─────────────────────────────────── */
const topbar = document.getElementById('topbar');

function handleNavbarScroll() {
  if (!topbar) return;
  if (window.scrollY > 20) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Executa na carga inicial

/* ─── Menu mobile (hamburger) ────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenu.classList.remove('open');
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
    } else {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fechar menu');
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileMenu.classList.add('open');
    }
  });

  // Fecha ao clicar em qualquer link do menu mobile
  mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fecha ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      navToggle.focus();
    }
  });
}

/* ─── Destaque do link ativo na navbar (scroll spy) ─────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[data-section]');

function updateActiveNav() {
  const scrollY = window.scrollY;
  const navH    = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
    10
  ) || 70;

  let currentSection = '';

  sections.forEach((section) => {
    const top = section.offsetTop - navH - 60;
    if (scrollY >= top) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('data-section') === currentSection
    );
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ─── Animação de revelação por scroll (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Lê o atraso em data-delay (cada unidade = 80ms)
          const delay = parseInt(entry.target.dataset.delay ?? '0', 10) * 80;
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Hero — revela imediatamente (já está visível) */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el) => {
    const delay = parseInt(el.dataset.delay ?? '0', 10) * 120;
    setTimeout(() => {
      el.style.transitionDelay = '0ms';
      el.classList.add('visible');
    }, delay + 80);
    revealObserver.unobserve(el);
  });

} else {
  /* Redução de movimento ou sem suporte: mostra tudo imediatamente */
  revealEls.forEach((el) => {
    el.style.transitionDelay = '0ms';
    el.classList.add('visible');
  });
}

/* ─── Rolagem suave para âncoras (fallback para navegadores
       que não suportam scroll-behavior: smooth no CSS) ───────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navH   = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      10
    ) || 70;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 12;

    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    // Atualiza o foco para acessibilidade
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  });
});

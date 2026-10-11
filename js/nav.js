// Shared nav: scroll state + hamburger + smooth anchors + profile label
(function () {
  const navbar = document.querySelector(".navbar");
  const onScroll = () => navbar && navbar.classList.toggle("scrolled", window.scrollY > 50);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const btn = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("active");
      btn.classList.toggle("active", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("active")));
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("animate-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".tech-item, .daily-card, .experience-card").forEach((el) => io.observe(el));
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
})();

const menu = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");

menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  nav.style.display = open ? "none" : "flex";
  nav.style.position = "absolute";
  nav.style.top = "70px";
  nav.style.right = "0";
  nav.style.flexDirection = "column";
  nav.style.padding = "18px";
  nav.style.background = "rgba(15,15,15,.94)";
  nav.style.border = "1px solid rgba(255,255,255,.12)";
  nav.style.borderRadius = "18px";
  nav.style.backdropFilter = "blur(20px)";
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

// SkeletKey — minimal interactivity
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });

    // Close menu when a link is clicked
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
      });
    });
  }

  // Subtle nav background on scroll
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.style.background = "rgba(11, 15, 25, 0.95)";
    } else {
      nav.style.background = "rgba(11, 15, 25, 0.85)";
    }
  });
});

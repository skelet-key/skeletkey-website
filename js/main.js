// SkeletKey — minimal interactivity
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });

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

  // Order form basic feedback
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      // If the Formspree ID hasn't been replaced yet, fall back to mailto
      if (form.action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        const name = form.name.value;
        const email = form.email.value;
        const interest = form.interest.value;
        const message = form.message.value || "";
        const subject = encodeURIComponent("SkeletKey Reservation Request");
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:nate@skeletkey.com?subject=${subject}&body=${body}`;
      }
    });
  }
});

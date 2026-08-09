document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    nav.style.background =
      window.scrollY > 40 ? "rgba(11, 15, 25, 0.95)" : "rgba(11, 15, 25, 0.85)";
  });

  function showToast(message, isError) {
    let toast = document.getElementById("sk-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "sk-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = "sk-toast" + (isError ? " sk-toast-error" : " sk-toast-success");
    void toast.offsetWidth;
    toast.classList.add("sk-toast-show");
    setTimeout(() => toast.classList.remove("sk-toast-show"), 3000);
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".form-submit");
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      try {
        const data = new FormData(form);
        const res = await fetch("https://formsubmit.co/ajax/nateclaudemcdowel@gmail.com", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          showToast("Briefing request sent. We'll respond within 1–2 business days.");
        } else {
          showToast("Something went wrong. Email nateclaudemcdowel@gmail.com directly.", true);
        }
      } catch {
        showToast("Network error. Email nateclaudemcdowel@gmail.com directly.", true);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
      }
    });
  }
});

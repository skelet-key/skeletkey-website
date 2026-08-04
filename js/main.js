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

  // Toast helper
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
    // force reflow so animation restarts
    void toast.offsetWidth;
    toast.classList.add("sk-toast-show");
    setTimeout(() => {
      toast.classList.remove("sk-toast-show");
    }, 3000);
  }

  // Order form — AJAX to FormSubmit so user stays on skeletkey.com
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".form-submit");
      const originalText = btn ? btn.textContent : "";
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
          showToast("Request sent — we'll follow up within 24–48 hours.");
        } else {
          showToast("Something went wrong. Please try again or email nate@skeletkey.com.", true);
        }
      } catch (err) {
        showToast("Network error. Please try again or email nate@skeletkey.com.", true);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    });
  }
});

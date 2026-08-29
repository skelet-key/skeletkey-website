// SkeletKey — minimal interactivity
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const nav = document.getElementById("siteNav") || document.querySelector(".nav");
  const mobile = document.getElementById("navMobile");
  let menuScrollY = 0;

  function setMenuOpen(open) {
    if (!nav) return;
    nav.classList.toggle("is-menu-open", open);
    if (toggle) {
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (mobile) {
      mobile.classList.toggle("is-open", open);
      mobile.setAttribute("aria-hidden", open ? "false" : "true");
    }
    document.documentElement.classList.toggle("nav-menu-open", open);
    if (open) {
      menuScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + menuScrollY + "px";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, menuScrollY);
    }
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      setMenuOpen(!nav.classList.contains("is-menu-open"));
    });
  }

  if (mobile) {
    mobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
  }

  if (links) {
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
  }

  const onNavScroll = () => {
    if (!nav || nav.classList.contains("is-menu-open")) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onNavScroll();
  window.addEventListener("scroll", onNavScroll, { passive: true });

  // WiCi-style fade-up reveals
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initHeroRotator() {
    const clip = document.querySelector(".hero-rotator-clip");
    const inner = document.querySelector(".hero-rotator-inner");
    if (!clip || !inner) return;
    const items = Array.from(inner.children);
    if (!items.length) return;

    inner.style.animation = "none";

    function setWidth(el, animate) {
      clip.style.transition = animate
        ? "width 0.75s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";
      clip.style.width = Math.ceil(el.scrollWidth) + "px";
    }

    function drawUnderline() {
      clip.classList.remove("is-drawn");
      void clip.offsetWidth;
      clip.classList.add("is-drawn");
    }

    function show(index, animate) {
      items.forEach((el, n) => {
        el.classList.toggle("is-active", n === index);
        el.classList.toggle("is-exit", animate && n !== index);
      });
      setWidth(items[index], animate);
      if (animate) drawUnderline();
      else clip.classList.add("is-drawn");
    }

    show(0, false);

    if (reduceMotion || items.length < 2) return;

    let i = 0;
    setInterval(() => {
      i = (i + 1) % items.length;
      show(i, true);
    }, 3600);

    window.addEventListener("resize", () => setWidth(items[i], false), { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setWidth(items[i], false));
    }
  }
  initHeroRotator();

  const revealNodes = document.querySelectorAll(".reveal, .section-inner, .diff-card, .phone-card, .maintain-card, .fold-card, .bike-card, .own-card");
  if (reduceMotion) {
    revealNodes.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealNodes.forEach((el, i) => {
      if (el.closest(".hero")) return;
      el.classList.add("reveal");
      if (el.parentElement && el.parentElement.classList.contains("diff-grid")) {
        el.style.transitionDelay = (i % 6) * 70 + "ms";
      }
      io.observe(el);
    });
  } else {
    revealNodes.forEach((el) => el.classList.add("is-visible"));
  }

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

  // Pre-select co-founder interest when arriving from Work with us CTA
  function selectCofounderInterest() {
    const interest = document.getElementById("interest");
    if (interest) interest.value = "cofounder";
  }
  document.querySelectorAll('a[href="#order"]').forEach((a) => {
    if (a.textContent.toLowerCase().includes("co-founder") || a.closest("#work")) {
      a.addEventListener("click", () => setTimeout(selectCofounderInterest, 0));
    }
  });
  if (window.location.hash === "#order" && /cofounder|co-founder/i.test(window.location.search + document.referrer)) {
    selectCofounderInterest();
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
        const interestVal = data.get("interest");
        if (interestVal === "cofounder") {
          data.set("_subject", "SkeletKey Co-Founder Application");
        }
        const res = await fetch("https://formsubmit.co/ajax/nateclaudemcdowel@gmail.com", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          const msg =
            interestVal === "cofounder"
              ? "Application sent — we'll be in touch."
              : "Request sent — we'll follow up within 24–48 hours.";
          showToast(msg);
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

  // Commute savings calculator (USA, gallons)
  (function initSavings() {
    const form = document.getElementById("savingsForm");
    if (!form) return;
    const mpgEl = document.getElementById("savMpg");
    const milesEl = document.getElementById("savMiles");
    const gasEl = document.getElementById("savGas");
    const kwhEl = document.getElementById("savKwh");
    const results = document.getElementById("savingsResults");

    const PUCA_KWH_PER_MI = 8.5 / 100;
    const MSRP = 6999;

    function money(n) {
      const abs = Math.abs(n);
      const formatted = abs.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: abs >= 100 ? 0 : 2,
      });
      return n < 0 ? "−" + formatted : formatted;
    }

    function paybackCopy(years) {
      if (!isFinite(years) || years <= 0) return "—";
      const totalMonths = Math.round(years * 12);
      if (totalMonths < 1) return "under a month";
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      if (y === 0) return m === 1 ? "1 month" : m + " months";
      if (m === 0) return y === 1 ? "1 year" : y + " years";
      return (y === 1 ? "1 year" : y + " years") + ", " + (m === 1 ? "1 month" : m + " months");
    }

    function calc() {
      const mpg = parseFloat(mpgEl.value);
      const dailyMiles = parseFloat(milesEl.value);
      const gas = parseFloat(gasEl.value);
      const kwh = parseFloat(kwhEl.value);
      if (!(mpg > 0 && dailyMiles > 0 && gas > 0 && kwh > 0)) return;

      const milesYear = dailyMiles * 365;
      const saveYear = (milesYear / mpg) * gas - milesYear * PUCA_KWH_PER_MI * kwh;
      document.getElementById("savWeek").textContent = money(saveYear / 52);
      document.getElementById("savMonth").textContent = money(saveYear / 12);
      document.getElementById("savYear").textContent = money(saveYear);
      document.getElementById("savWarranty").textContent = money(saveYear * 3.5);
      const pb = document.getElementById("savPayback");
      const note = document.getElementById("savPaybackNote");
      if (saveYear <= 0) {
        pb.textContent = "N/A";
        if (note) note.textContent = "This mileage costs more on Puca than gas at those rates.";
      } else {
        pb.textContent = paybackCopy(MSRP / saveYear);
        if (note) {
          note.textContent =
            "At $6,999 MSRP from fuel savings alone — charging at home in the U.S.";
        }
      }
      results.hidden = false;
      results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      calc();
    });
  })();
});

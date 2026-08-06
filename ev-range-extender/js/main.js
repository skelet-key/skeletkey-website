document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("tocToggle");
  const side = document.getElementById("tocSide");
  if (toggle && side) {
    toggle.addEventListener("click", () => side.classList.toggle("open"));
    side.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => side.classList.remove("open"));
    });
  }
});

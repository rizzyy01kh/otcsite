/* ===============================
   CHINESE NEW YEAR ANIMATIONS
================================ */

// Lanterns already in HTML

// Firework dots
function firework() {
  const dot = document.createElement("div");
  dot.className = "cny-spark";

  dot.style.left = Math.random() * window.innerWidth + "px";
  dot.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(dot);

  setTimeout(() => dot.remove(), 1200);
}

// Control frequency (safe)
setInterval(firework, 400);

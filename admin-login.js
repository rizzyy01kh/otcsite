document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // 🔑 REQUIRED

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // TEMP ADMIN LOGIN (for testing)
    if (email === "admin@printstore.com" && password === "admin123") {
      window.location.href = "dashboard.html";
    } else {
      errorMsg.textContent = "Invalid email or password";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Año dinámico
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

  // Menú hamburguesa
  const toggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (toggleBtn && navMenu) {
      toggleBtn.addEventListener("click", () => {
          navMenu.classList.toggle("show");
      });

      // Cerrar menú al hacer clic en un enlace (móvil)
      navMenu.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
              navMenu.classList.remove("show");
          });
      });
  }
});

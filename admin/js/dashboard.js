const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".layout_toggle");
const logoBtn = document.querySelector(".open_sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

logoBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  }
});

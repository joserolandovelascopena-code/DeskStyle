const headerFlotante = document.querySelector(".menu_flotante");
let timer;
window.addEventListener("scroll", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (window.scrollY > 100) {
      headerFlotante.classList.add("show");
    } else if (window.scrollY <= 100) {
      headerFlotante.classList.remove("show");
    }
  });
});

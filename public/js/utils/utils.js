export class verContraseña {
  constructor(input, bnt_icono) {
    this.input = document.getElementById(input);
    this.btn = document.getElementById(bnt_icono);

    if (this.btn) {
      this.btn.addEventListener("click", () => {
        this.verPass();
      });
    }
  }

  verPass() {
    const icons = {
      visiblePass: "visibility_off",
      noVisible: "visibility",
    };

    if (this.input.type === "password") {
      this.input.type = "text";
      this.btn.textContent = icons.noVisible;
    } else {
      this.input.type = "password";
      this.btn.textContent = icons.visiblePass;
    }
  }
}

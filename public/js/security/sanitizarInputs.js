function escoparHTML(input_text) {
  const div = document.createElement("div");
  div.textContent = input_text;

  let resul = div.innerHTML;
  console.log("Texto: " + resul);
  return div.innerHTML;
}

export { escoparHTML };

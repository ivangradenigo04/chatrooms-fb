export function init() {
  class Header extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      this.innerText = this.textContent as any;
      this.style.display = "flex";
      this.style.justifyContent = "center";
      this.style.alignItems = "center";
      this.style.height = "50px";
      this.style.width = "100%";
      this.style.fontSize = "22px";
      this.style.backgroundColor = "#FF8282";
    }
  }
  customElements.define("header-el", Header);
}

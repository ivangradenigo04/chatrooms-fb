export function init() {
  class Text extends HTMLElement {
    text: string | null;
    variant: string | null;

    constructor() {
      super();
    }

    connectedCallback() {
      this.text = this.textContent;
      this.variant = this.getAttribute("variant");
      this.render();
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .title,.subtitle,.body{
        color:black
      }

      .title{
        font-size:52px;
        font-weight:700;
        display:inline
      }
      
      .subtitle{
        font-size:22px;
        font-weight:500;
        display:block;
        margin:10px 0;
      }

      .body{
        font-size:18px;
        font-weight:400;
      }
      
      .label{
        font-size:14px;
        font-weight:400;
        color:#A5A5A5;
      }
      `;

      this.className = this.variant || "";
      this.textContent = this.text;
      this.appendChild(style);
    }
  }
  customElements.define("text-el", Text);
}

import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "signup-page",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.render();
      }

      connectedListeners() {
        const formEl = this.shadow.querySelector("form-el");
        const form = formEl?.shadowRoot?.querySelector("form");
        form?.addEventListener("submit", (e: any) => {
          e.preventDefault();
          const fullName = e.target["name"].value;
          const email = e.target["email"].value;
          if (fullName && email) {
            state.signUp(fullName, email);
            Router.go("/");
          }
        });
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          padding: 30px;
          height: 90%;
        }

        @media (min-width: 768px) {
          .root {
            padding: 30px 250px;
          }
        }

          .title__container {
            margin-top:15px;
            margin-bottom:30px
          }
          `;

        this.shadow.innerHTML = `
          <header-el></header-el>
          <div class="root">
          <div class="title__container">
          <text-el variant="title">Registrate</text-el>
          </div>
          <div class="form__container">
          <form-el class="subtitle__container" variant="signup"></form-el>
          </div>
          </div>
          `;

        this.connectedListeners();
        this.shadow.appendChild(style);
      }
    }
  );
}

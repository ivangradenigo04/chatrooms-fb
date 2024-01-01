import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "home-page",
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
        const button = this.shadow.querySelector(".button");
        const formEl = this.shadow.querySelector("form-el");
        const form = formEl?.shadowRoot?.querySelector("form");

        button?.addEventListener("click", () => {
          Router.go("/signup");
        });

        form?.addEventListener("submit", (e: any) => {
          e.preventDefault();
          const fullName = e.target["name"].value;
          const email = e.target["email"].value;
          const selectChatroom = e.target["room"].value;
          if (fullName && email && selectChatroom == "new") {
            state.setNameAndEmail(fullName, email);
            state.signIn(() => {
              state.askNewRoom(() => {
                state.accessToRoom();
              });
            });
            Router.go("/chat");
          } else if (fullName && email && selectChatroom == "existing") {
            state.setNameAndEmail(fullName, email);
            state.setChatroomId(e.target["id"].value);
            state.signIn(() => {
              state.accessToRoom();
            });
            Router.go("/chat");
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
            margin-bottom:30px;
            display:flex;
            justify-content:space-between
          }

          .button {
            display: inline;
            border-radius: 50%;
            padding: 30px 5px; 
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: black; 
            background-color: #ffe454; 
            border: none; 
            cursor: pointer;
            transition: background-color 0.3s; 
            font-family: "Roboto";
          }
      
          /* Cambios al pasar el ratón sobre el botón */
          .button:hover {
            background-color: #f1d644; 
          }
          `;

        this.shadow.innerHTML = `
          <header-el></header-el>
          <div class="root">
          <div class="title__container">
          <text-el variant="title">Bienvenidx</text-el>
          <button class="button">Registrarse</button>
          </div>
          <div class="form__container">
          <form-el variant="home"></form-el>
          </div>
          </div>
          `;

        this.connectedListeners();
        this.shadow.appendChild(style);
      }
    }
  );
}

export function init() {
  class Form extends HTMLElement {
    shadow: ShadowRoot;
    variant: string;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.variant = this.getAttribute("variant") as any;
    }

    connectedCallback() {
      this.render();
    }

    connectedListeners() {
      const selectEl = this.shadow.querySelector("select");
      const inputEl = this.shadow.querySelector(".hidden");

      selectEl?.addEventListener("change", (e) => {
        const target = e.target as any;
        if (target.value == "existing") {
          inputEl?.classList.remove("hidden");
        } else {
          inputEl?.classList.add("hidden");
        }
      });
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .form {
        display:grid;
        gap:12px
      }

      .label {
        display:grid;
        gap:5px
      }

      .input{
        padding:17px 13px;
        font-size:18px;
        border-radius: 4px;
        border: 2px solid #000;
      }

      .hidden{
        display:none;
      }
      
      .button{
          cursor:pointer;
          padding:17px 13px;
          font-size:22px;
          font-weight:700;
          display:block;
          text-align:center;
          border-radius: 4px;
          width:100%;
          background-color:#9CBBE9;
          border: none;
        }
      `;

      if (this.variant == "home") {
        this.shadow.innerHTML = ` 
        <div class="root"> 
        <form class="form">
        <label class="label"><text-el variant="body">Tu nombre</text-el>
        <input class="input" type="text" name="name"/>
        </label>
        <label class="label"><text-el variant="body">Tu email</text-el>
        <input class="input" type="text" name="email"/>
        </label>
        <label class="label"><text-el variant="body">Room</text-el>
        <select class="input" name="room">
        <option class="option" value="new">Nuevo room</option>
        <option class="option" value="existing">Room existente</option>
        <select/>
        </label>
        <label class="label hidden"><text-el variant="body">Room ID</text-el>
        <input class="input" type="text" name="id"/>
        </label>
        <button class="button">Comenzar</button>   
        </form> 
        </div> 
        `;
      } else if (this.variant == "signup") {
        this.shadow.innerHTML = ` 
        <div class="root"> 
        <form class="form">
        <label class="label"><text-el variant="body">Nombre completo</text-el>
        <input class="input" type="text" name="name"/>
        </label>
        <label class="label"><text-el variant="body">Email</text-el>
        <input class="input" type="text" name="email"/>
        </label>
        <button class="button">Comenzar</button>   
        </form> 
        </div> 
        `;
      } else if (this.variant == "chat") {
        this.shadow.innerHTML = ` 
        <div class="root"> 
        <form class="form">
        <input class="input" type="text" name="new-message" placeholder="Mensaje"/>
        <button class="button">Enviar</button>   
        </form> 
        </div> 
        `;
      }

      this.shadow.appendChild(style);
      this.connectedListeners();
    }
  }
  customElements.define("form-el", Form);
}

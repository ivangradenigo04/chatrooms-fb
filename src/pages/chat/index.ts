import { state } from "../../state";

type Message = {
  from;
  message;
};

function init() {
  customElements.define(
    "chat-page",
    class extends HTMLElement {
      shadow: ShadowRoot;
      chatroomId: string;
      messages: Message[] = [];

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        const currentState = state.getState();
        this.messages = currentState.messages;
        this.chatroomId = currentState.chatroomId;
        state.subscribe(() => {
          this.messages = currentState.messages;
          this.render();
        });
        this.render();
      }

      connectedListeners() {
        const formEl = this.shadow.querySelector("form-el");
        const form = formEl?.shadowRoot?.querySelector("form");
        form?.addEventListener("submit", (e: any) => {
          e.preventDefault();
          if (e.target["new-message"].value) {
            state.pushMessage(e.target["new-message"].value);
          }
        });
      }

      scrollToBottom() {
        const messagesContainer = this.shadow.querySelector(".messages") as any;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
          .root {
            height:81.5vh;
            display: flex;
            flex-direction:column;
            justify-content:space-between;
            padding: 30px;
          }

          @media (min-width: 768px) {
            .root {
              padding: 30px 250px;
            }
          }
          
          .messages{
            overflow:scroll;
            overflow-x: hidden;
            height:100%
          }

          .message{
            margin-bottom:15px;
            display:table;
          }
          
          .message-card{
            margin-top:5px;
            border-radius: 4px;
            background-color: #D8D8D8;
            padding:15px;
          }
          
          .my-message{
            margin-left: auto;
            margin-right: 0;
          }

          .my-message-card{
            background-color: #B9E97C;
          }
          `;

        this.shadow.innerHTML = `
          <header-el>Chatroom:${this.chatroomId}</header-el>
          <div class="root">
          <div class="messages">
          ${this.messages
            .map((m) => {
              const currentState = state.getState();
              if (m.from == currentState.fullName) {
                return `
                <div class="message my-message">
                <text-el variant="label">${m.from}</text-el>
                <div class="message-card my-message-card">
                <text-el variant="body">${m.message}</text-el>
                </div>
                </div>
                `;
              } else {
                return `
                <div class="message">
                <text-el variant="label">${m.from}</text-el>
                <div class="message-card">
                <text-el variant="body">${m.message}</text-el>
                </div>
                </div>
                `;
              }
            })
            .join("")}
          </div> 
          <div class="form__container">
          <form-el class="subtitle__container" variant="chat"></form-el>
          </div>    
          </div>    
          `;

        this.shadow.appendChild(style);
        this.connectedListeners();
        this.scrollToBottom();
      }
    }
  );
}

export { Message, init };

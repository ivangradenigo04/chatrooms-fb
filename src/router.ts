import { Router } from "@vaadin/router";
import { init as initHomePage } from "./pages/home";
import { init as initSignUp } from "./pages/sign-up";
import { init as initChatPage } from "./pages/chat";

export function init(root: HTMLElement | null) {
  initHomePage();
  initSignUp();
  initChatPage();
  const router = new Router(root);

  router.setRoutes([
    { path: "/", component: "home-page" },
    { path: "/signup", component: "signup-page" },
    { path: "/chat", component: "chat-page" },
  ]);
}

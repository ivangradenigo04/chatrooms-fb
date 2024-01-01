import { init as initRouter } from "./router";
import { init as initHeader } from "./components/header";
import { init as initText } from "./components/text";
import { init as initForm } from "./components/form";
import { state } from "./state";

(function () {
  state.init();
  initHeader();
  initText();
  initForm();
  initRouter(document.querySelector(".root"));
})();

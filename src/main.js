import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "./assets/app.scss";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import { createPinia } from "pinia";
const pinia = createPinia();
Vue.use(pinia);

import vueMultiselect from "vue-multiselect";
Vue.component("multiselect", vueMultiselect);
import "../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.debug = () => {};
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

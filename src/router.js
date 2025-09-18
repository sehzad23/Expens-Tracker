import Vue from "vue";
import VueRouter from "vue-router";

import ExpensList from "./components/ExpensList.vue";
import ExpensAddForm from "./components/ExpensAddForm.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: ExpensList },
  { path: "/expensaddform", component: ExpensAddForm },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;

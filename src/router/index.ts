import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PlaylistView from "@/views/PlaylistView.vue";
import CollectionList from "@/components/CollectionList.vue";
import CreateFilmPage from "@/views/CreateFilmPage.vue";
import { useAuthStore } from "../stores/auth.ts";
import { setAuthToken } from "../axios-instance.ts";
import BaseAuthView from "@/views/BaseAuthView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/collections",
      name: "collections",
      component: CollectionList,
      meta: { requiresAuth: true },
    },
    {
      path: "/auth",
      name: "auth",
      component: BaseAuthView,
      meta: { requiresAuth: false },
    },
    {
      path: "/watchlists/:id",
      name: "watchlists",
      component: PlaylistView,
      meta: { requiresAuth: true },
    },
    {
      path: "/mixes/:id",
      name: "mixes",
      component: PlaylistView,
      meta: { requiresAuth: true },
    },
    {
      path: "/create-film/:id",
      name: "create-film",
      component: CreateFilmPage,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: "auth" });
  } else {
    setAuthToken(authStore.token);
    next();
  }
});

export default router;

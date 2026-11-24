import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/global";

import HomePage from "../pages/HomePage.vue";
import PostDetailPage from "../pages/PostDetailPage.vue";
import CreatePostPage from "../pages/CreatePostPage.vue";
import EditPostPage from "../pages/EditPostPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/posts/:id", name: "post-detail", component: PostDetailPage },
  {
    path: "/create",
    name: "create-post",
    component: CreatePostPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/posts/:id/edit",
    name: "edit-post",
    component: EditPostPage,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/register", name: "register", component: RegisterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
  }
});

export default router;
<template>
  <nav class="navbar sticky-top bg-white border-bottom py-3 mb-4">
    <div class="container">
      <router-link class="navbar-brand fw-bold text-dark fs-5" to="/">
        BLOG
      </router-link>

      <div class="d-flex align-items-center gap-3">
        <router-link class="text-decoration-none text-secondary fw-medium small" to="/">
          Explore
        </router-link>

        <template v-if="auth.isAuthenticated">
          <router-link class="btn btn-primary btn-sm px-3" to="/create">
            + Write
          </router-link>

          <div class="d-none d-sm-flex align-items-center gap-2 ps-3 border-start">
            <span class="small fw-semibold text-dark">{{ displayName }}</span>
            <span
              v-if="auth.isAdmin"
              class="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle"
              style="font-size: 0.7rem;"
            >
              Admin
            </span>
          </div>

          <button
            class="btn btn-sm btn-outline-secondary px-3"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>

        <template v-else>
          <router-link class="text-decoration-none text-dark fw-medium small" to="/login">
            Sign in
          </router-link>
          <router-link class="btn btn-primary btn-sm px-3" to="/register">
            Get started
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/global";

const auth = useAuthStore();
const router = useRouter();

const displayName = computed(() => {
  return auth.user?.username || auth.user?.email?.split("@")[0] || "Writer";
});

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>
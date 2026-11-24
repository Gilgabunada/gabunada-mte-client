<template>
  <div class="mx-auto" style="max-width: 420px;">
    <h2 class="mb-4">Login</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/global";

const auth = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message || "Invalid credentials.";
  }
};
</script>
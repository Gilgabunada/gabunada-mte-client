<template>
  <div class="mx-auto" style="max-width: 480px;">
    <h2 class="mb-4">Register</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="form.username" type="text" class="form-control" required />
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">First Name</label>
          <input v-model="form.firstName" type="text" class="form-control" required />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Last Name</label>
          <input v-model="form.lastName" type="text" class="form-control" required />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <div class="input-group">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "Hide" : "Show" }}
          </button>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          class="form-control"
          :class="{ 'is-invalid': confirmPassword && form.password !== confirmPassword }"
          required
        />
        <div class="invalid-feedback">
          Passwords do not match.
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
        {{ submitting ? "Creating Account..." : "Create Account" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/global";
import notyf from "../utils/notify";

const auth = useAuthStore();
const router = useRouter();

const error = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const submitting = ref(false);

const form = reactive({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  error.value = "";

  if (form.password !== confirmPassword.value) {
    error.value = "Password and Confirm Password must match.";
    notyf.error(error.value);
    return;
  }

  submitting.value = true;
  try {
    await auth.register({
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });
    notyf.success("Account created! Please sign in.");
    router.push("/login");
  } catch (err) {
    const message = err.response?.data?.message || "Registration failed.";
    error.value = message;
    notyf.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
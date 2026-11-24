<template>
  <div class="mx-auto" style="max-width: 650px;">
    <h2 class="mb-4">Edit Post</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form v-if="!loading" @submit.prevent="handleUpdate">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea v-model="content" rows="8" class="form-control" required></textarea>
      </div>
      <button type="submit" class="btn btn-success me-2">Save Changes</button>
      <router-link :to="`/posts/${route.params.id}`" class="btn btn-secondary">Cancel</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import notyf from "../utils/notify";

const route = useRoute();
const router = useRouter();
const title = ref("");
const content = ref("");
const error = ref("");
const loading = ref(true);
const submitting = ref(false);

onMounted(async () => {
  try {
    const { data } = await api.get(`/posts/${route.params.id}`);
    const post = data.post || data;
    title.value = post.title;
    content.value = post.content;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to load post.";
    error.value = message;
    notyf.error(message);
  } finally {
    loading.value = false;
  }
});

const handleUpdate = async () => {
  submitting.value = true;
  error.value = "";
  try {
    await api.put(`/posts/${route.params.id}`, {
      title: title.value,
      content: content.value,
    });
    notyf.success("Post updated!");
    router.push(`/posts/${route.params.id}`);
  } catch (err) {
    const message = err.response?.data?.message || "Failed to update post.";
    error.value = message;
    notyf.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
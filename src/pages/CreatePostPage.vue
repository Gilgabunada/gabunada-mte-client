<template>
  <div class="mx-auto" style="max-width: 650px;">
    <h2 class="mb-4">Create New Post</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="handleCreate">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea v-model="content" rows="8" class="form-control" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        Publish Post
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import notyf from "../utils/notify";

const router = useRouter();
const title = ref("");
const content = ref("");
const error = ref("");
const submitting = ref(false);

const handleCreate = async () => {
  submitting.value = true;
  error.value = "";
  try {
    const { data } = await api.post("/posts", {
      title: title.value,
      content: content.value,
    });
    notyf.success("Post published!");
    const postId = data.post?._id || data._id;
    router.push(postId ? `/posts/${postId}` : "/");
  } catch (err) {
    const message = err.response?.data?.message || "Failed to create post.";
    error.value = message;
    notyf.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
<template>
  <div v-if="loading">Loading post...</div>
  <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

  <div v-else-if="post" class="mx-auto" style="max-width: 800px;">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h1>{{ post.title }}</h1>
        <p class="text-muted">
          By <strong>{{ post.author?.firstName }} {{ post.author?.lastName }}</strong>
          (@{{ post.author?.username }}) &bull; {{ new Date(post.createdAt).toLocaleString() }}
        </p>
      </div>

      <div class="d-flex gap-2">
        <router-link
          v-if="isOwner"
          :to="`/posts/${post._id}/edit`"
          class="btn btn-sm btn-warning"
        >
          Edit
        </router-link>
        <button
          v-if="canDelete"
          @click="handleDelete"
          class="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body" style="white-space: pre-line;">
        {{ post.content }}
      </div>
    </div>

    <!-- Comments Section -->
    <h4 class="mb-3">Comments ({{ post.comments?.length || 0 }})</h4>

    <form v-if="auth.isAuthenticated" @submit.prevent="submitComment" class="mb-4">
      <div class="input-group">
        <input
          v-model="commentText"
          type="text"
          class="form-control"
          placeholder="Write a comment..."
          required
        />
        <button class="btn btn-primary" type="submit" :disabled="submittingComment">
          Post
        </button>
      </div>
    </form>
    <p v-else class="text-muted small">
      <router-link to="/login">Log in</router-link> to leave a comment.
    </p>

    <div v-if="post.comments?.length" class="list-group">
      <div
        v-for="comment in post.comments"
        :key="comment._id"
        class="list-group-item"
      >
        <div class="d-flex justify-content-between">
          <strong>@{{ comment.username }}</strong>
          <small class="text-muted">{{ new Date(comment.createdAt).toLocaleString() }}</small>
        </div>
        <p class="mb-0 mt-1">{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/global";
import api from "../api";
import notyf from "../utils/notify";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const post = ref(null);
const loading = ref(true);
const error = ref("");
const commentText = ref("");
const submittingComment = ref(false);

const isOwner = computed(() => {
  const userId = auth.user?.id || auth.user?._id;
  return auth.isAuthenticated && !!userId && post.value?.author?._id === userId;
});

const canDelete = computed(() => {
  return isOwner.value || auth.isAdmin;
});

const fetchPost = async () => {
  try {
    const { data } = await api.get(`/posts/${route.params.id}`);
    post.value = data.post || data;
  } catch (err) {
    const message = err.response?.data?.message || "Post not found.";
    error.value = message;
    notyf.error(message);
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  if (!commentText.value.trim()) return;
  submittingComment.value = true;
  try {
    const { data } = await api.post(`/posts/${route.params.id}/comments`, {
      text: commentText.value,
    });
    post.value.comments = data.comments || data.post?.comments || [];
    commentText.value = "";
    notyf.success("Comment added.");
  } catch (err) {
    notyf.error(err.response?.data?.message || "Failed to add comment.");
  } finally {
    submittingComment.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm("Delete this post?")) return;
  try {
    await api.delete(`/posts/${route.params.id}`);
    notyf.success("Post deleted.");
    router.push("/");
  } catch (err) {
    notyf.error(err.response?.data?.message || "Failed to delete post.");
  }
};

onMounted(fetchPost);
</script>
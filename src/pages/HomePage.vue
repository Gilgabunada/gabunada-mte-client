<template>
  <div>
    <!-- Simple Header + Search -->
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
      <h1 class="h3 fw-bold mb-0">Blog Posts</h1>

      <div class="input-group" style="max-width: 280px;">
        <input
          v-model.trim="searchQuery"
          type="search"
          class="form-control"
          placeholder="Search posts..."
        />
        <button
          v-if="searchQuery"
          type="button"
          class="btn btn-outline-secondary"
          @click="searchQuery = ''"
        >
          Clear
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-muted py-4">Loading posts...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="filteredPosts.length === 0" class="post-card text-center text-muted py-5">
      {{ searchQuery ? `No posts found for "${searchQuery}".` : "No posts yet." }}
    </div>

    <!-- Uniform Post Cards -->
    <div v-else class="row g-4">
      <div class="col-md-6" v-for="post in filteredPosts" :key="post._id">
        <article class="post-card h-100 d-flex flex-column">
          <h2 class="h5 fw-bold mb-2">
            <router-link :to="`/posts/${post._id}`" class="text-decoration-none text-dark">
              {{ post.title }}
            </router-link>
          </h2>

          <p class="post-excerpt mb-3">{{ post.content }}</p>

          <div class="text-muted small mb-3">
            By {{ post.author?.firstName }} {{ post.author?.lastName }}
            (@{{ post.author?.username }}) &middot; {{ formatDate(post.createdAt) }}
          </div>

          <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <router-link :to="`/posts/${post._id}`" class="btn btn-sm btn-primary">
              Read Post
            </router-link>
            <span class="text-muted small">
              {{ post.comments?.length || 0 }} comments
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../api"; // update path if your axios file is in another folder

const posts = ref([]);
const searchQuery = ref("");
const loading = ref(true);
const error = ref("");

const filteredPosts = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return posts.value;
  return posts.value.filter((post) => {
    const author = `${post.author?.firstName || ""} ${post.author?.lastName || ""} ${post.author?.username || ""}`.toLowerCase();
    return (
      post.title?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q) ||
      author.includes(q)
    );
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

onMounted(async () => {
  try {
    const { data } = await api.get("/posts");
    posts.value = data.posts || [];
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load posts.";
  } finally {
    loading.value = false;
  }
});
</script>
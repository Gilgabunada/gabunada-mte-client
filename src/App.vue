<template>
  <Navbar />
  <main class="container pb-5">
    <router-view />
  </main>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>
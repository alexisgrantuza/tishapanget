<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    <p>Welcome to your protected dashboard!</p>
    <p>User ID: {{ user?.id }}</p>
    <p>Email: {{ user?.email }}</p>
  </div>
</template>

<script setup>
// Apply auth middleware to this page
definePageMeta({
  middleware: "auth",
});

const user = useSupabaseUser();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">Confirming your account...</h2>
      <p>Please wait while we confirm your authentication.</p>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();

// Redirect to home once authenticated
watch(
  user,
  () => {
    if (user.value) {
      navigateTo("/dashboard");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md space-y-6 p-6">
      <h1 class="text-2xl font-bold text-center">Reset your password</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 w-full px-3 py-2 border rounded-md"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          {{ loading ? "Sending..." : "Send reset link" }}
        </button>
      </form>
      <p v-if="message" class="text-center text-sm">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const loading = ref(false);
const message = ref("");

const onSubmit = async () => {
  loading.value = true;
  message.value = "";
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/confirm`,
    });
    if (error) throw error;
    message.value = "If the email exists, a reset link has been sent.";
  } catch (e: any) {
    message.value = e.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md space-y-6 p-6">
      <h1 class="text-2xl font-bold text-center">Create an account</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">First name</label>
          <input
            v-model="firstName"
            class="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Last name</label>
          <input
            v-model="lastName"
            class="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Username</label>
          <input
            v-model="username"
            class="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          {{ loading ? "Creating..." : "Create account" }}
        </button>
      </form>
      <p v-if="message" class="text-center text-sm">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signUp } = useAuth();

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const message = ref("");

const onSubmit = async () => {
  loading.value = true;
  message.value = "";
  const { error } = await signUp(email.value, password.value, {
    username: username.value,
    firstName: firstName.value,
    lastName: lastName.value,
  });
  if (error) {
    message.value = error;
  } else {
    message.value = "Check your email for the confirmation link.";
    await navigateTo("/confirm");
  }
  loading.value = false;
};
</script>

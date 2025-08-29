<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <NuxtPage />
    <Toaster />
  </div>
</template>

<script setup>
import { Toaster } from "@/components/ui/sonner";

useHead({
  title: "TaskFlow - Modern Task Management",
  meta: [
    {
      name: "description",
      content: "A modern task management app inspired by Trello",
    },
  ],
});
</script>

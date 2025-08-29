<template>
  <div class="relative w-full">
    <UiResizableNavbar :items="navItems" />
    <div class="h-[600px]" />
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Contact", link: "#contact" },
];
</script>

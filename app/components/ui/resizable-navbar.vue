<template>
  <div ref="navRef" :class="wrapperClasses">
    <!-- Desktop Navigation -->
    <div :class="desktopClasses" :style="desktopStyle">
      <!-- Logo -->
      <a
        href="#"
        class="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
      >
        <img :src="logoSrc" alt="logo" width="30" height="30" />
        <span class="font-medium dark:text-black text-white">{{
          brandName
        }}</span>
      </a>

      <!-- Center items -->
      <div
        class="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2"
        @mouseleave="hoveredIndex = null"
      >
        <a
          v-for="(item, idx) in items"
          :key="`link-${idx}`"
          :href="item.link"
          class="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
          @mouseenter="hoveredIndex = idx"
        >
          <span
            v-if="hoveredIndex === idx"
            class="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
          />
          <span class="relative z-20">{{ item.name }}</span>
        </a>
      </div>

      <!-- Right actions -->
      <div class="ml-auto flex items-center gap-4">
        <NuxtLink
          type="button"
          class="px-4 py-2 rounded-md bg-transparent shadow-none dark:text-black text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center"
          to="/login"
        >
          Login
        </NuxtLink>
        <button
          type="button"
          class="px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
        >
          Book a call
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div :class="mobileClasses" :style="mobileStyle">
      <div class="flex w-full flex-row items-center justify-between">
        <a
          href="#"
          class="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
        >
          <img :src="logoSrc" alt="logo" width="30" height="30" />
          <span class="font-medium text-black dark:text-white">{{
            brandName
          }}</span>
        </a>
        <button type="button" class="p-2" @click="toggleMobileMenu">
          <svg
            v-if="isMobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-black dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-black dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="isMobileMenuOpen"
          class="absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950"
        >
          <a
            v-for="(item, idx) in items"
            :key="`mobile-link-${idx}`"
            :href="item.link"
            class="relative text-neutral-600 dark:text-neutral-300"
            @click="isMobileMenuOpen = false"
          >
            <span class="block">{{ item.name }}</span>
          </a>
          <div class="flex w-full flex-col gap-4">
            <button
              type="button"
              class="w-full px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              @click="isMobileMenuOpen = false"
            >
              Login
            </button>
            <button
              type="button"
              class="w-full px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              @click="isMobileMenuOpen = false"
            >
              Book a call
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";

interface NavItem {
  name: string;
  link: string;
}

const props = defineProps<{
  items: NavItem[];
  brandName?: string;
  logoSrc?: string;
  stickyOffsetClass?: string;
}>();

const brandName = computed(() => props.brandName ?? "Trallo");
const logoSrc = computed(
  () => props.logoSrc ?? "https://assets.aceternity.com/logo-dark.png"
);

const navRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const hoveredIndex = ref<number | null>(null);
const isMobileMenuOpen = ref(false);

const wrapperClasses = computed(() => {
  const base = "fixed inset-x-0 top-10 z-40 w-full";
  // Change to 'fixed' if you want a fixed navbar
  return base;
});

const desktopClasses = computed(() => [
  "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
  isVisible.value ? "bg-white/80 dark:bg-neutral-950/80" : "",
]);

const desktopStyle = computed(() => ({
  backdropFilter: isVisible.value ? "blur(10px)" : "none",
  boxShadow: isVisible.value
    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
    : "none",
  width: isVisible.value ? "40%" : "100%",
  transform: `translateY(${isVisible.value ? 20 : 0}px)`,
  minWidth: "800px",
  transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
}));

const mobileClasses = computed(() => [
  "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
  isVisible.value ? "bg-white/80 dark:bg-neutral-950/80" : "",
]);

const mobileStyle = computed(() => ({
  backdropFilter: isVisible.value ? "blur(10px)" : "none",
  boxShadow: isVisible.value
    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
    : "none",
  width: isVisible.value ? "90%" : "100%",
  paddingRight: isVisible.value ? "12px" : "0px",
  paddingLeft: isVisible.value ? "12px" : "0px",
  borderRadius: isVisible.value ? "4px" : "2rem",
  transform: `translateY(${isVisible.value ? 20 : 0}px)`,
  transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
}));

function onScroll() {
  isVisible.value = (window.scrollY || 0) > 100;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

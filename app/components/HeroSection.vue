<template>
  <div
    class="relative mx-auto -mt-96 flex max-w-7xl flex-col items-center justify-center"
  >
    <!-- Content -->
    <div class="px-4 py-10 md:py-20">
      <h1
        class="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold dark:text-slate-700 md:text-4xl lg:text-7xl text-slate-300"
      >
        <span
          v-for="(word, index) in headingWords"
          :key="index"
          class="mr-2 inline-block animate-fade-up"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          {{ word }}
        </span>
      </h1>

      <p
        class="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 opacity-0 animate-fade-in dark:text-neutral-400"
        style="animation-delay: 800ms"
      >
        Plan projects, track progress, and collaborate in real-time. Build your
        boards, lists, and tasks in minutes — not days.
      </p>

      <div
        class="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in"
        style="animation-delay: 1000ms"
      >
        <button
          class="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
        >
          Create your first board
        </button>
        <button
          class="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900 cursor-pointer"
        >
          Explore templates
        </button>
      </div>

      <div
        class="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-2 shadow-md opacity-0 animate-fade-in dark:border-neutral-800 dark:bg-neutral-900"
        style="animation-delay: 1200ms"
      >
        <div
          class="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700"
        >
          <img
            src="https://cdn.dribbble.com/userupload/12194106/file/original-57fe1b8f5c66a4ae8df065608c338220.jpg?resize=752x&vertical=center"
            alt="App preview"
            class="aspect-[16/9] h-auto w-full object-cover -mt-10"
            height="1000"
            width="1000"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const headingWords = "Organize your work in minutes, not days".split(" ");
</script>

<style scoped>
@keyframes fade-up {
  0% {
    opacity: 0;
    filter: blur(4px);
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0px);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-up {
  animation: fade-up 300ms ease-in-out forwards;
}

.animate-fade-in {
  animation: fade-in 300ms ease-in-out forwards;
}
</style>

<template>
  <section id="how-it-works" class="relative mx-auto max-w-7xl px-4 py-24">
    <h2 class="mb-6 text-center text-3xl font-bold text-white md:text-5xl">
      How it works
    </h2>
    <p class="mx-auto mb-12 max-w-2xl text-center text-neutral-300">
      From zero to productive boards in three simple steps.
    </p>

    <ol
      class="relative mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
    >
      <li
        v-for="(step, idx) in steps"
        :key="step.title"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-300 hover:bg-white/10"
      >
        <div
          class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-bold"
        >
          {{ idx + 1 }}
        </div>
        <h3 class="mb-2 text-lg font-semibold text-white">{{ step.title }}</h3>
        <p class="text-sm text-neutral-300">{{ step.desc }}</p>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "Create a board",
    desc: "Start with a board for your project or team.",
  },
  {
    title: "Add lists & cards",
    desc: "Break down work into lists and actionable cards.",
  },
  {
    title: "Collaborate",
    desc: "Invite teammates, assign tasks, and track progress.",
  },
];
</script>

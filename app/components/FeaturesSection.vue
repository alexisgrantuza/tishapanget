<template>
  <section id="features" class="relative mx-auto max-w-7xl px-4 py-24">
    <h2 class="mb-6 text-center text-3xl font-bold text-white md:text-5xl">
      Powerful features
    </h2>
    <p class="mx-auto mb-12 max-w-2xl text-center text-neutral-300">
      Boards, lists, and cards that scale with your team. Designed for clarity
      and speed.
    </p>

    <div
      class="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3"
    >
      <div
        v-for="(item, i) in items"
        :key="item.title"
        :class="[
          'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border p-4 transition duration-200',
          'border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10',
          { 'md:col-span-2': i === 3 || i === 6 },
        ]"
      >
        <!-- Header  -->
        <div
          class="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800"
        />

        <div class="transition duration-200">
          <div class="mb-2 flex items-center gap-2 text-neutral-300">
            <span class="text-lg">{{ item.icon }}</span>
          </div>
          <div class="mt-2 mb-2 font-sans text-base font-bold text-neutral-100">
            {{ item.title }}
          </div>
          <div class="font-sans text-xs font-normal text-neutral-300">
            {{ item.description }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    icon: "↕",
    title: "Drag & Drop",
    description:
      "Smooth reordering of cards and lists with intuitive interactions.",
  },
  {
    icon: "▦",
    title: "Board Hierarchy",
    description: "Organize work into boards, lists, and cards with ease.",
  },
  {
    icon: "🤝",
    title: "Collaboration",
    description:
      "Assign, comment, and mention teammates with real-time presence.",
  },
  {
    icon: "⏱",
    title: "Real-time Updates",
    description: "Stay in sync across devices with instantaneous updates.",
  },
  {
    icon: "📱",
    title: "Responsive",
    description: "Optimized for mobile, tablet, and desktop workflows.",
  },
  {
    icon: "🔗",
    title: "Integrations",
    description: "Connect with tools you already use to automate work.",
  },
  {
    icon: "🔒",
    title: "Permissions",
    description: "Granular access control for boards, lists, and cards.",
  },
];
</script>

<template>
  <section id="testimonials" class="relative mx-auto max-w-7xl px-4 py-24">
    <h2 class="mb-6 text-center text-3xl font-bold text-white md:text-5xl">
      Loved by teams
    </h2>
    <p class="mx-auto mb-12 max-w-2xl text-center text-neutral-300">
      Feedback from power users who run their work on our boards.
    </p>

    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2">
      <!-- Image stack -->
      <div>
        <div class="relative h-80 w-full">
          <div
            v-for="(t, index) in testimonials"
            :key="t.src"
            class="absolute inset-0 origin-bottom rounded-3xl"
            :style="imageStyle(index)"
          >
            <img
              :src="t.src"
              :alt="t.name"
              width="500"
              height="500"
              draggable="false"
              class="h-full w-full rounded-3xl object-cover object-center shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </div>

      <!-- Copy & controls -->
      <div class="flex flex-col justify-between py-4">
        <div :key="active">
          <h3 class="text-2xl font-bold text-white">{{ safeCurrent.name }}</h3>
          <p class="text-sm text-neutral-400">{{ safeCurrent.designation }}</p>
          <p class="mt-8 text-lg text-neutral-300">
            <span
              v-for="(word, i) in safeCurrent.quote.split(' ')"
              :key="i"
              class="inline-block opacity-0 translate-y-[5px] blur-[10px] animate-word"
              :style="{ animationDelay: `${i * 35}ms` }"
            >
              {{ word }}&nbsp;
            </span>
          </p>
        </div>
        <div class="flex gap-4 pt-12 md:pt-0">
          <button
            @click="prev"
            class="group flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur text-neutral-200 transition hover:bg-white/20 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              <path
                fill-rule="evenodd"
                d="M15.78 4.72a.75.75 0 010 1.06L9.56 12l6.22 6.22a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            @click="next"
            class="group flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur text-neutral-200 transition hover:bg-white/20 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                fill-rule="evenodd"
                d="M8.22 19.28a.75.75 0 010-1.06L14.44 12 8.22 5.78a.75.75 0 111.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 01-1.06 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const testimonials = ref<Testimonial[]>([
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    name: "James Kim",
    designation: "Engineering Lead at DataPro",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
    name: "Lisa Thompson",
    designation: "VP of Technology at FutureNet",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=1200&auto=format&fit=crop",
  },
]);

const active = ref(0);
const autoplay = ref(true);
let intervalId: number | undefined;

function next() {
  active.value = (active.value + 1) % testimonials.value.length;
}
function prev() {
  active.value =
    (active.value - 1 + testimonials.value.length) % testimonials.value.length;
}

// Pre-defined rotation values to ensure consistent SSR/CSR hydration
const rotationValues = [
  -7, 2, -3, 5, 1, -5, 3, -2, 4, -1, 6, -4, 7, -6, 8, -8, 9, -9, 10, -10,
];

function randomRotate(index: number) {
  return rotationValues[index % rotationValues.length];
}

const current = computed<Testimonial | undefined>(
  () => testimonials.value[active.value]
);
const safeCurrent = computed<Testimonial>(
  () =>
    current.value ??
    ({ quote: "", name: "", designation: "", src: "" } as Testimonial)
);

function imageStyle(index: number) {
  const isActive = index === active.value;
  const zIndex = isActive ? 40 : testimonials.value.length + 2 - index;
  const scale = isActive ? 1 : 0.95;
  const opacity = isActive ? 1 : 0.7;
  const rotate = isActive ? 0 : randomRotate(index);
  const translateY = isActive ? "0px" : "0px";
  return {
    zIndex: String(zIndex),
    opacity: String(opacity),
    transform: `scale(${scale}) rotate(${rotate}deg) translateY(${translateY})`,
    transition: "opacity 400ms ease, transform 400ms ease",
  };
}

onMounted(() => {
  if (autoplay.value) {
    intervalId = window.setInterval(() => next(), 5000);
  }
});

onBeforeUnmount(() => {
  if (intervalId) window.clearInterval(intervalId);
});
</script>

<style scoped>
@keyframes wordIn {
  0% {
    opacity: 0;
    transform: translateY(5px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.animate-word {
  animation: wordIn 200ms ease-in-out forwards;
}
</style>

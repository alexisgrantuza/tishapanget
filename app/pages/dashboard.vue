<template>
  <div
    class="h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white"
  >
    <!-- Top Navigation Bar -->
    <nav
      class="flex items-center justify-between px-4 py-3 bg-black bg-opacity-20"
    >
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <!-- Board Title -->
        <div class="flex items-center space-x-2">
          <h1 class="text-lg font-semibold">My Trello board</h1>
          <ChevronDown class="w-4 h-4" />
        </div>

        <!-- Board Type Badge -->
        <div class="px-2 py-1 text-xs bg-blue-600 rounded">📋</div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-3">
        <!-- Action Icons -->
        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Rocket class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Zap class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Filter class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Users class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Star class="w-4 h-4" />
        </Button>

        <!-- Avatar -->
        <div
          class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-semibold"
        >
          JM
        </div>

        <!-- Share Button -->
        <Button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2">
          Share
        </Button>

        <!-- Menu Button -->
        <Button
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </div>
    </nav>

    <!-- Board Content -->
    <div class="flex-1 p-4">
      <div class="flex space-x-4 h-full overflow-x-auto">
        <!-- Sample Lists -->
        <div
          v-for="(list, index) in lists"
          :key="index"
          class="flex-shrink-0 w-80"
        >
          <div class="bg-gray-100 rounded-lg p-3 h-fit">
            <!-- List Header -->
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">{{ list.title }}</h3>
              <Button
                variant="ghost"
                size="sm"
                class="text-gray-600 hover:bg-gray-200"
              >
                <MoreHorizontal class="w-4 h-4" />
              </Button>
            </div>

            <!-- Cards -->
            <div class="space-y-2 mb-3">
              <div
                v-for="(card, cardIndex) in list.cards"
                :key="cardIndex"
                class="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <p class="text-gray-800 text-sm">{{ card.title }}</p>
                <div
                  v-if="card.labels && card.labels.length > 0"
                  class="flex space-x-1 mt-2"
                >
                  <span
                    v-for="(label, labelIndex) in card.labels"
                    :key="labelIndex"
                    :class="[
                      'w-8 h-2 rounded-full',
                      label === 'green'
                        ? 'bg-green-500'
                        : label === 'yellow'
                          ? 'bg-yellow-500'
                          : label === 'orange'
                            ? 'bg-orange-500'
                            : label === 'red'
                              ? 'bg-red-500'
                              : label === 'purple'
                                ? 'bg-purple-500'
                                : label === 'blue'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500',
                    ]"
                  ></span>
                </div>
                <div
                  v-if="card.members"
                  class="flex items-center justify-between mt-2"
                >
                  <div class="flex -space-x-1">
                    <div
                      v-for="(member, memberIndex) in card.members"
                      :key="memberIndex"
                      class="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold"
                    >
                      {{ member }}
                    </div>
                  </div>
                  <div
                    v-if="card.comments"
                    class="flex items-center text-gray-500"
                  >
                    <MessageSquare class="w-3 h-3 mr-1" />
                    <span class="text-xs">{{ card.comments }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Card Button -->
            <Button
              variant="ghost"
              class="w-full text-gray-600 hover:bg-gray-200 justify-start"
            >
              <Plus class="w-4 h-4 mr-2" />
              Add a card
            </Button>
          </div>
        </div>

        <!-- Add List Button -->
        <div class="flex-shrink-0 w-80">
          <Button
            variant="ghost"
            class="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white justify-start p-3 rounded-lg"
            @click="addList"
          >
            <Plus class="w-4 h-4 mr-2" />
            Add another list
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ChevronDown,
  Rocket,
  Zap,
  Filter,
  Users,
  Star,
  MoreHorizontal,
  Plus,
  MessageSquare,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";

// Sample data
const lists = ref([
  {
    title: "To Do",
    cards: [
      {
        title: "Design new landing page",
        labels: ["green", "yellow"],
        members: ["JD", "AM"],
        comments: 3,
      },
      {
        title: "Review user feedback",
        labels: ["red"],
        members: ["SK"],
      },
    ],
  },
  {
    title: "In Progress",
    cards: [
      {
        title: "Implement authentication system",
        labels: ["blue", "orange"],
        members: ["JM", "RK"],
        comments: 5,
      },
    ],
  },
  {
    title: "Done",
    cards: [
      {
        title: "Set up project structure",
        labels: ["green"],
        members: ["JM"],
      },
      {
        title: "Create initial wireframes",
        labels: ["purple"],
        members: ["AM", "SK"],
      },
    ],
  },
]);

// Functions
// const addCard = (listIndex: number) => {
//   const cardTitle = prompt("Enter card title:");
//   if (cardTitle) {
//     lists.value[listIndex].cards.push({
//       title: cardTitle,
//       labels: [],
//       members: [],
//     });
//   }
// };

const addList = () => {
  const listTitle = prompt("Enter list title:");
  if (listTitle) {
    lists.value.push({
      title: listTitle,
      cards: [],
    });
  }
};
</script>

<style scoped>
/* Custom scrollbar for horizontal overflow */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

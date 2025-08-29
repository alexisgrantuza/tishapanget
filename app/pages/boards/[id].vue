<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-5"
  >
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
        Trello Board
      </h1>
      <p class="text-purple-200 text-lg">
        Organize your tasks with drag & drop
      </p>
    </div>

    <div class="max-w-screen mx-auto">
      <div class="flex gap-5 items-start overflow-x-auto pb-5">
        <draggable
          v-model="lists"
          group="lists"
          item-key="id"
          class="flex gap-5 items-start p-2"
          :animation="200"
          ghost-class="list-ghost"
          chosen-class="list-chosen"
          drag-class="list-drag"
          @start="onListDragStart"
          @end="onListDragEnd"
        >
          <template #item="{ element: list }">
            <TaskList
              :key="list.id"
              :list="list"
              @add-card="addCard"
              @add-template-card="addTemplateCard"
              @update-card="updateCard"
              @delete-card="deleteCard"
              @list-drag-start="onListDragStart"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over="handleDragOver"
              @drop="handleDrop"
              :drag-over-list="dragOverList"
              :drag-over-index="dragOverIndex"
            />
          </template>
        </draggable>

        <!-- Add another list section -->
        <div class="min-w-[280px] flex-shrink-0">
          <div
            v-if="!showAddListForm"
            class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg cursor-pointer text-center font-medium transition-all duration-200 border-2 border-dashed border-white/30 hover:border-white/50 transform hover:scale-105 mt-2"
            @click="showAddListForm = true"
          >
            + Add another list
          </div>
          <div
            v-else
            class="bg-white p-4 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300"
          >
            <input
              ref="listNameInput"
              v-model="newListName"
              type="text"
              placeholder="Enter list title..."
              class="w-full p-3 border-2 border-gray-200 rounded-md text-sm mb-3 focus:border-purple-500 focus:outline-none transition-colors"
              @keyup.enter="createList"
              @blur="createList"
            />
            <div class="flex gap-2">
              <button
                @click="createList"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add List
              </button>
              <button
                @click="cancelAddList"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import draggable from "vuedraggable";

const lists = ref([
  {
    id: 1,
    name: "Today",
    color: "#8B5A2B",
    cards: [{ id: 1, content: "Start using Trello", completed: false }],
  },
  {
    id: 2,
    name: "This Week",
    color: "#2F855A",
    cards: [{ id: 2, content: "hello", completed: false }],
  },
  {
    id: 3,
    name: "Later",
    color: "#1A202C",
    cards: [{ id: 3, content: "asdasdasd", completed: true }],
  },
]);

const showAddListForm = ref(false);
const newListName = ref("");
const draggedCard = ref(null);
const dragOverList = ref(null);
const dragOverIndex = ref(null);
const listNameInput = ref(null);

const colors = [
  "#8B5A2B",
  "#2F855A",
  "#1A202C",
  "#805AD5",
  "#D69E2E",
  "#E53E3E",
  "#38B2AC",
  "#F56565",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const createList = () => {
  if (newListName.value.trim()) {
    const newList = {
      id: Date.now(),
      name: newListName.value.trim(),
      color: getRandomColor(),
      cards: [],
    };
    lists.value.push(newList);
    newListName.value = "";
    showAddListForm.value = false;
  }
};

const cancelAddList = () => {
  showAddListForm.value = false;
  newListName.value = "";
};

const addCard = (listId, content) => {
  if (!content.trim()) return;

  const list = lists.value.find((list) => list.id === listId);
  if (list) {
    list.cards.push({
      id: Date.now(),
      content: content.trim(),
      completed: false,
    });
  }
};

const addTemplateCard = (listId) => {
  // Create a template card with predefined content
  const list = lists.value.find((list) => list.id === listId);
  if (list) {
    list.cards.push({
      id: Date.now(),
      content: "Template card - Click to edit",
      completed: false,
      isTemplate: true,
    });
  }
};

const updateCard = (listId, cardId, updates) => {
  const list = lists.value.find((list) => list.id === listId);
  if (list) {
    const card = list.cards.find((card) => card.id === cardId);
    if (card) {
      Object.assign(card, updates);
    }
  }
};

const deleteCard = (listId, cardId) => {
  const list = lists.value.find((list) => list.id === listId);
  if (list) {
    const index = list.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      list.cards.splice(index, 1);
    }
  }
};

const handleDragStart = (card, sourceListId, event) => {
  draggedCard.value = { ...card, sourceListId };
  event.dataTransfer.effectAllowed = "move";

  // Add dragging class to card after a brief delay
  nextTick(() => {
    event.target.classList.add(
      "opacity-50",
      "rotate-2",
      "scale-105",
      "shadow-2xl",
      "z-50"
    );
  });
};

const handleDragEnd = (event) => {
  // Remove dragging classes
  event.target.classList.remove(
    "opacity-50",
    "rotate-2",
    "scale-105",
    "shadow-2xl",
    "z-50"
  );
  draggedCard.value = null;
  dragOverList.value = null;
  dragOverIndex.value = null;
};

const handleDragOver = (listId, index = null) => {
  dragOverList.value = listId;
  dragOverIndex.value = index;
};

const handleDrop = (targetListId, targetIndex = null) => {
  if (!draggedCard.value) return;

  const sourceListId = draggedCard.value.sourceListId;
  const cardToMove = { ...draggedCard.value };
  delete cardToMove.sourceListId;

  // Remove card from source list
  const sourceList = lists.value.find((list) => list.id === sourceListId);
  if (sourceList) {
    const cardIndex = sourceList.cards.findIndex(
      (card) => card.id === cardToMove.id
    );
    if (cardIndex !== -1) {
      sourceList.cards.splice(cardIndex, 1);
    }
  }

  // Add card to target list
  const targetList = lists.value.find((list) => list.id === targetListId);
  if (targetList) {
    if (targetIndex !== null) {
      targetList.cards.splice(targetIndex, 0, cardToMove);
    } else {
      targetList.cards.push(cardToMove);
    }
  }

  draggedCard.value = null;
  dragOverList.value = null;
  dragOverIndex.value = null;
};

const onListDragStart = (event) => {
  // Add dragging class to list after a brief delay
  nextTick(() => {
    // Find the list element and add dragging classes
    const listElement = event.item;
    if (listElement) {
      listElement.classList.add("opacity-80", "rotate-1", "shadow-2xl", "z-50");
    }
  });
};

const onListDragEnd = (event) => {
  // Remove dragging classes
  const listElement = event.item;
  if (listElement) {
    listElement.classList.remove(
      "opacity-80",
      "rotate-1",
      "shadow-2xl",
      "z-50"
    );
  }
};

// Watch for when form becomes visible to focus input
watch(showAddListForm, async (newVal) => {
  if (newVal) {
    await nextTick();
    listNameInput.value?.focus();
  }
});
</script>

<style scoped>
/* List dragging styles */
.list-ghost {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px dashed rgba(255, 255, 255, 0.4) !important;
  transform: rotate(1deg) scale(0.98);
  transition: all 0.2s ease;
}

.list-chosen {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.list-drag {
  opacity: 0.9;
  transform: rotate(1deg) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  z-index: 1001;
}

/* Ensure the draggable container maintains proper layout */
:deep(.flex) {
  display: flex !important;
}

:deep(.gap-5) {
  gap: 1.25rem !important;
}

:deep(.items-start) {
  align-items: flex-start !important;
}

:deep(.overflow-x-auto) {
  overflow-x: auto !important;
}

:deep(.pb-5) {
  padding-bottom: 1.25rem !important;
}
</style>

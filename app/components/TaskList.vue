<template>
  <div
    class="min-w-[280px] max-w-[280px] rounded-xl p-0 flex flex-col shadow-lg overflow-visible group relative"
    :style="{ backgroundColor: list.color }"
    :class="{ 'opacity-80': isOptimistic }"
  >
    <!-- Simple optimistic indicator -->
    <div
      v-if="isOptimistic"
      class="absolute top-2 right-2 w-3 h-3 bg-transparent rounded-full animate-pulse"
    ></div>
    <div class="flex justify-between items-center p-4 relative">
      <h3 class="text-white text-base font-bold flex-1 drop-shadow-sm">
        {{ list.name }}
      </h3>
      <div
        class="flex gap-1 opacity-80 transition-opacity group-hover:opacity-100"
      >
        <Button
          variant="ghost"
          size="sm"
          class="text-white/80 hover:text-white hover:bg-white/15 h-7 w-7 p-0"
          title="Move list"
          @mousedown="onListDragStart"
        >
          <svg
            fill="none"
            viewBox="0 0 16 16"
            role="presentation"
            class="h-4 w-4"
          >
            <path
              fill="currentcolor"
              fill-rule="evenodd"
              d="M6.25 8.75H0v-1.5h6.25zm3.5-1.5H16v1.5H9.75z"
              clip-rule="evenodd"
            ></path>
            <path
              fill="currentcolor"
              fill-rule="evenodd"
              d="M5.19 8 2.22 5.03l1.06-1.06 3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5-1.06-1.06zm4.03-.53 3.5-3.5 1.06 1.06L10.81 8l2.97 2.97-1.06 1.06-3.5-3.5a.75.75 0 0 1 0-1.06"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              class="text-white/80 hover:text-white hover:bg-white/15 h-7 w-7 p-0"
              title="More options"
            >
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>List Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="editListName" class="cursor-pointer">
              <Edit3 class="mr-2 h-4 w-4" />
              <span>Edit List Name</span>
            </DropdownMenuItem>

            <DropdownMenuItem @click="copyList" class="cursor-pointer">
              <Copy class="mr-2 h-4 w-4" />
              <span>Copy List</span>
            </DropdownMenuItem>

            <DropdownMenuItem @click="moveAllCards" class="cursor-pointer">
              <ArrowRight class="mr-2 h-4 w-4" />
              <span>Move All Cards</span>
            </DropdownMenuItem>

            <DropdownMenuItem @click="archiveAllCards" class="cursor-pointer">
              <Archive class="mr-2 h-4 w-4" />
              <span>Archive All Cards</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem @click="sortCards" class="cursor-pointer">
              <ArrowUpDown class="mr-2 h-4 w-4" />
              <span>Sort Cards</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              @click="archiveList"
              class="cursor-pointer text-orange-600 focus:text-orange-600"
            >
              <Archive class="mr-2 h-4 w-4" />
              <span>Archive List</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              @click="deleteList"
              class="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 class="mr-2 h-4 w-4" />
              <span>Delete List</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <draggable
      v-model="localCards"
      group="cards"
      item-key="id"
      class="min-h-[10px] flex flex-col gap-2 px-3 pb-2 flex-1"
      :animation="200"
      ghost-class="sortable-ghost"
      chosen-class="sortable-chosen"
      drag-class="sortable-drag"
      @start="onDragStart"
      @end="onDragEnd"
      @change="onCardChange"
    >
      <template #item="{ element: card }">
        <TaskCard
          :card="card"
          @update="updateCard(card.id, $event)"
          @delete="deleteCard(card.id)"
        />
      </template>
    </draggable>

    <div class="p-2">
      <div v-if="!showAddCardForm" class="flex gap-2">
        <Button
          variant="ghost"
          class="text-white/90 hover:text-white hover:bg-white/0 justify-start flex-1 h-10"
          @click="showAddCardForm = true"
        >
          <Plus class="mr-2 h-4 w-4 opacity-80" />
          Add a card
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="text-white/80 hover:text-white hover:bg-white/0 h-10 w-10 p-0"
          title="Create from template"
          @click="createFromTemplate"
        >
          <svg
            width="24"
            height="24"
            role="presentation"
            focusable="false"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6V5C3 3.89543 3.89543 3 5 3H6C6.55228 3 7 3.44772 7 4C7 4.55228 6.55228 5 6 5H5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 8C6 6.89543 6.89543 6 8 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H8C6.89543 20 6 19.1046 6 18V8ZM8 8H19V14H8V8ZM18 18C17.4477 18 17 17.5523 17 17C17 16.4477 17.4477 16 18 16C18.5523 16 19 16.4477 19 17C19 17.5523 18.5523 18 18 18ZM8 17C8 17.5523 8.44772 18 9 18H12C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16H9C8.44772 16 8 16.4477 8 17Z"
              fill="currentColor"
            ></path>
            <path
              d="M4 14C3.44772 14 3 14.4477 3 15V16C3 17.1046 3.89543 18 5 18V15C5 14.4477 4.55228 14 4 14Z"
              fill="currentColor"
            ></path>
            <path
              d="M3 9C3 8.44772 3.44772 8 4 8C4.55228 8 5 8.44772 5 9V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V9Z"
              fill="currentColor"
            ></path>
            <path
              d="M8 4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H9C8.44772 5 8 4.55228 8 4Z"
              fill="currentColor"
            ></path>
            <path
              d="M16 3C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H19C19 3.89543 18.1046 3 17 3H16Z"
              fill="currentColor"
            ></path>
          </svg>
        </Button>
      </div>

      <Card v-else class="bg-gray-800 border-gray-700">
        <CardContent class="p-3">
          <Textarea
            v-model="newCardContent"
            placeholder="Enter a title for this card..."
            class="text-white bg-transparent border-gray-600 focus:border-blue-500 min-h-[60px] resize-none mb-3"
            @keydown.ctrl.enter="createCard"
            @keydown.escape="cancelAddCard"
            ref="cardContentInput"
          />
          <div class="flex gap-2">
            <Button
              @click="createCard"
              size="sm"
              class="bg-gray-600 hover:bg-gray-700"
            >
              Add Card
            </Button>
            <Button
              @click="cancelAddCard"
              variant="outline"
              size="sm"
              class="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit3,
  Copy,
  ArrowRight,
  Archive,
  ArrowUpDown,
  Trash2,
  Plus,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const props = defineProps({
  list: {
    type: Object,
    required: true,
  },
  isOptimistic: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update-list",
  "delete-list",
  "restore-list",
  "archive-list",
  "copy-list",
  "move-all-cards",
  "archive-all-cards",
  "sort-cards",
  "edit-list-name",
  "add-card",
  "add-template-card",
  "update-card",
  "delete-card",
  "list-drag-start",
]);

const localCards = ref([...props.list.cards]);
const showAddCardForm = ref(false);
const newCardContent = ref("");
const cardContentInput = ref(null);
const isDragging = ref(false);

// Watch for external changes to the list cards and update local state
watch(
  () => props.list.cards,
  (newCards) => {
    // Only update if the cards are actually different to avoid loops
    if (JSON.stringify(newCards) !== JSON.stringify(localCards.value)) {
      localCards.value = [...newCards];
    }
  },
  { deep: true }
);

const onDragStart = () => {
  isDragging.value = true;
};

const onDragEnd = () => {
  isDragging.value = false;
};

const onListDragStart = (event) => {
  emit("list-drag-start", props.list.id, event);
};

const onCardChange = (evt) => {
  // Handle all card changes in one place
  if (evt.added) {
    // Card was added to this list from another list
    const addedCard = evt.added.element;
    if (addedCard && addedCard.content) {
      // Update the parent list with the new card
      emit("update-list", props.list.id, { cards: localCards.value });
    }
  } else if (evt.removed) {
    // Card was removed from this list (moved to another list)
    const removedCard = evt.removed.element;
    if (removedCard && removedCard.id) {
      // Update the parent list with the removed card
      emit("update-list", props.list.id, { cards: localCards.value });
    }
  } else if (evt.moved) {
    // Card was moved within the same list
    emit("update-list", props.list.id, { cards: localCards.value });
  }
};

// Dropdown action methods
const editListName = () => {
  emit("edit-list-name", props.list.id);
};

const copyList = () => {
  emit("copy-list", props.list.id);
};

const moveAllCards = () => {
  emit("move-all-cards", props.list.id);
};

const archiveAllCards = () => {
  emit("archive-all-cards", props.list.id);
};

const sortCards = () => {
  emit("sort-cards", props.list.id);
};

const archiveList = () => {
  if (confirm(`Archive "${props.list.name}" list?`)) {
    emit("archive-list", props.list.id);
  }
};

const deleteList = async () => {
  // Optimistic: tell parent to remove immediately and keep snapshot to allow restore
  emit("delete-list", props.list.id, { snapshot: { ...props.list } });

  try {
    await $fetch("/api/lists", {
      method: "DELETE",
      body: { listId: props.list.id },
    });
    toast.success("List deleted");
  } catch (error) {
    console.error("Failed to delete list:", error);
    toast.error("Failed to delete list. Restoring...");
    emit("restore-list", props.list.id);
  }
};

// Card creation methods
const createCard = async () => {
  if (newCardContent.value.trim()) {
    const content = newCardContent.value.trim();
    // Clear form immediately for better UX
    newCardContent.value = "";
    showAddCardForm.value = false;
    // Emit the event
    emit("add-card", props.list.id, content);
  }
};

const createFromTemplate = () => {
  emit("add-template-card", props.list.id);
};

const cancelAddCard = () => {
  showAddCardForm.value = false;
  newCardContent.value = "";
};

const updateCard = (cardId, updatedCard) => {
  emit("update-card", props.list.id, cardId, updatedCard);
};

const deleteCard = (cardId) => {
  emit("delete-card", props.list.id, cardId);
};

// Watch for when form becomes visible to focus input
watch(showAddCardForm, async (newVal) => {
  if (newVal) {
    await nextTick();
    // Try to focus the textarea element
    if (cardContentInput.value) {
      // Check if it's a Vue component instance or DOM element
      const element = cardContentInput.value.$el || cardContentInput.value;
      if (element && typeof element.focus === "function") {
        element.focus();
      }
    }
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>

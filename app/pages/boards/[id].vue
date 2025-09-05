<template>
  <div class="min-h-screen" :style="backgroundStyle">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-border/40 bg-black">
      <div class="mx-auto flex h-16 items-center justify-between px-4">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg cursor-pointer"
              >
                <svg
                  class="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v18h-8V3z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-white">
                Trallo
              </h1>
              <p class="text-xs text-gray-400">Workspace</p>
            </div>
          </div>
        </div>

        <!-- Search & Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative hidden md:block">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search boards, cards, members..."
              class="h-10 w-80 rounded-lg border border-gray-600 bg-gray-800 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <!-- Create Button -->
          <button
            class="inline-flex h-10 items-center justify-center rounded-lg bg-gray-800 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-gray-700 cursor-pointer"
          >
            <Plus class="mr-2 h-4 w-4" />
            Create
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <Rocket class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <Zap class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <Filter class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <Users class="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <Star class="w-4 h-4" />
          </Button>

          <!-- Share Button -->
          <Button
            @click="openShareModal"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
          >
            <UserPlus class="w-4 h-4 mr-2" />
            Share
          </Button>

          <!-- Menu Button -->
          <Button
            variant="ghost"
            size="sm"
            class="text-white hover:bg-gray-800 hover:text-white"
          >
            <MoreHorizontal class="w-4 h-4" />
          </Button>

          <!-- Notifications -->
          <button
            class="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white cursor-pointer"
          >
            <Bell class="h-4 w-4" />
            <div
              class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"
            ></div>
          </button>

          <!-- User Menu Dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              :title="user?.email || 'User'"
            >
              {{
                user?.user_metadata?.first_name?.[0] || user?.email?.[0] || "U"
              }}
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-lg border border-gray-600 bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <!-- User Info Section -->
                <div class="px-4 py-3">
                  <p class="text-sm font-medium text-white truncate">
                    {{
                      user?.user_metadata?.full_name ||
                      user?.user_metadata?.first_name ||
                      "User"
                    }}
                  </p>
                  <p class="text-xs text-gray-400 truncate">
                    {{ user?.email || "user@example.com" }}
                  </p>
                </div>

                <!-- Navigation Links -->
                <div class="py-1">
                  <NuxtLink
                    to="#"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <User class="mr-3 h-4 w-4" />
                    Your Profile
                  </NuxtLink>

                  <NuxtLink
                    to="#"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Settings class="mr-3 h-4 w-4" />
                    Account Settings
                  </NuxtLink>

                  <NuxtLink
                    to="#"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <CreditCard class="mr-3 h-4 w-4" />
                    Billing
                  </NuxtLink>

                  <NuxtLink
                    to="#"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <HelpCircle class="mr-3 h-4 w-4" />
                    Help & Support
                  </NuxtLink>
                </div>

                <!-- Sign Out Section -->
                <div class="py-1">
                  <button
                    @click="handleSignOut"
                    class="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut class="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-screen mx-auto mt-10">
      <div class="flex gap-5 items-start overflow-x-auto pb-5 h-screen">
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
              :is-optimistic="list.isOptimistic"
              @add-card="addCard"
              @add-template-card="addTemplateCard"
              @update-card="updateCard"
              @delete-card="deleteCard"
              @delete-list="deleteList"
              @restore-list="restoreList"
              @update-list="updateList"
              @list-drag-start="onTaskListDragStart"
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
            class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg cursor-pointer text-center font-medium transition-all duration-200 border-2 border-dashed border-white/30 hover:border-white/50 transform mt-2"
            @click="showAddListForm = true"
          >
            + Add another list
          </div>
          <div
            v-else
            class="bg-white p-4 mt-2 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300"
          >
            <input
              ref="listNameInput"
              v-model="newListName"
              type="text"
              placeholder="Enter list title..."
              class="w-full p-3 border-2 border-gray-200 rounded-md text-sm mb-3 focus:border-purple-500 focus:outline-none transition-colors"
              @keyup.enter="createList"
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

    <!-- Share Board Modal -->
    <ShareBoardModal
      v-if="board?.id"
      :is-open="isShareModalOpen"
      :board-id="board.id"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
const route = useRoute();
import draggable from "vuedraggable";
import {
  Bell,
  CreditCard,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Star,
  Users,
  Filter,
  Rocket,
  Zap,
  MoreHorizontal,
  UserPlus,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useTasks } from "@/composables/useTasks";
import { useLists } from "@/composables/useLists";
import { Button } from "@/components/ui/button";
import ShareBoardModal from "@/components/ShareBoardModal.vue";

const lists = ref([]);
const deletedListSnapshots = ref(new Map());
const board = ref(null);
const loading = ref(false);

const showAddListForm = ref(false);
const newListName = ref("");
const draggedCard = ref(null);
const dragOverList = ref(null);
const dragOverIndex = ref(null);
const listNameInput = ref(null);
const isShareModalOpen = ref(false);
const backgroundStyle = computed(() => {
  const color =
    board.value?.color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  if (typeof color === "string" && color.trim().startsWith("url")) {
    return {
      backgroundImage: color,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: color };
});

// User menu dropdown state
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);
const user = useSupabaseUser();
const { signOut } = useAuth();
const {
  createTask,
  updateTask: apiUpdateTask,
  deleteTask: apiDeleteTask,
  reorderTasks,
} = useTasks();

const { reorderLists } = useLists();

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

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};
// Fetch board by id
const fetchBoard = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    const data = await $fetch(`/api/boards/${id}`);
    board.value = data;
    lists.value = (data?.lists || []).map((l) => ({
      id: l.id,
      name: l.name,
      color: l.color || "#1A202C",
      position: l.position || 0,
      cards: (l.cards || []).map((c) => ({
        id: c.id,
        content: c.title || "",
        completed: !!c.isArchived,
        listId: l.id,
        position: c.position || 0,
      })),
    }));
  } catch (e) {
    console.error("Failed to load board", e);
  } finally {
    loading.value = false;
  }
};

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const createList = async () => {
  if (!newListName.value.trim() || !board.value?.id) return;

  const color = getRandomColor();
  const tempId = `temp-${Date.now()}`;

  // Create optimistic list
  const optimisticList = {
    id: tempId,
    name: newListName.value.trim(),
    color: color,
    cards: [],
    position: lists.value.length + 1, // Set position based on current length
    isOptimistic: true,
  };

  // Add to UI immediately
  lists.value.push(optimisticList);

  // Clear form immediately
  newListName.value = "";
  showAddListForm.value = false;

  try {
    // Send to server
    const created = await $fetch("/api/lists", {
      method: "POST",
      body: { boardId: board.value.id, name: optimisticList.name, color },
    });

    // Replace optimistic list with real one
    const optimisticIndex = lists.value.findIndex((l) => l.id === tempId);
    if (optimisticIndex !== -1) {
      lists.value[optimisticIndex] = {
        id: created.id,
        name: created.name,
        color: created.color || color,
        position: created.position || lists.value.length,
        cards: (created.cards || []).map((c) => ({
          id: c.id,
          content: c.title || "",
          completed: !!c.isArchived,
          listId: created.id,
          position: c.position || 0,
        })),
        isOptimistic: false,
      };
    }

    toast.success("List created successfully!");
  } catch (error) {
    console.error("Failed to create list", error);

    // Remove optimistic list on error
    const optimisticIndex = lists.value.findIndex((l) => l.id === tempId);
    if (optimisticIndex !== -1) {
      lists.value.splice(optimisticIndex, 1);
    }

    // Show error and restore form
    toast.error("Failed to create list. Please try again.");
    newListName.value = optimisticList.name;
    showAddListForm.value = true;
  }
};

const cancelAddList = () => {
  showAddListForm.value = false;
  newListName.value = "";
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

const onListDragEnd = async (event) => {
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

  // Save list positions to database
  try {
    const listPositions = lists.value.map((list, index) => ({
      listId: list.id,
      position: index + 1, // Position starts from 1
    }));

    await reorderLists(listPositions);
  } catch (error) {
    console.error("Failed to save list positions:", error);
    toast.error("Failed to save list order. Please try again.");
  }
};

const onTaskListDragStart = (listId, event) => {
  // Handle drag start from TaskList component
  console.log("TaskList drag start:", listId);
};

// Card management functions
const addCard = async (listId, content) => {
  const list = lists.value.find((l) => l.id === listId);
  if (!list) return;

  // Create optimistic card for immediate UI feedback
  const tempId = `temp-${Date.now()}`;
  const optimisticCard = {
    id: tempId,
    content: content,
    completed: false,
    listId: listId,
    position: list.cards.length + 1, // Set position based on current length
  };
  list.cards.push(optimisticCard);

  try {
    // Save to database
    const created = await createTask(listId, content);

    // Replace optimistic card with real one from database
    const cardIndex = list.cards.findIndex((c) => c.id === tempId);
    if (cardIndex !== -1) {
      list.cards[cardIndex] = {
        id: created.id,
        content: created.title || content,
        completed: false,
        listId: listId,
        position: created.position || list.cards.length,
      };
    }

    toast.success("Card created successfully!");
  } catch (error) {
    console.error("Failed to create card:", error);

    // Remove optimistic card on error
    const cardIndex = list.cards.findIndex((c) => c.id === tempId);
    if (cardIndex !== -1) {
      list.cards.splice(cardIndex, 1);
    }

    toast.error("Failed to create card. Please try again.");
  }
};

const updateCard = async (listId, cardId, updatedCard) => {
  const list = lists.value.find((l) => l.id === listId);
  if (!list) return;

  const cardIndex = list.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return;

  // Store previous state for rollback
  const previousCard = { ...list.cards[cardIndex] };

  // Apply optimistic update
  list.cards[cardIndex] = { ...list.cards[cardIndex], ...updatedCard };

  try {
    // Save to database
    await apiUpdateTask(cardId, {
      content: updatedCard.content,
      completed: updatedCard.completed,
    });
  } catch (error) {
    console.error("Failed to update card:", error);

    // Rollback on error
    list.cards[cardIndex] = previousCard;
    toast.error("Failed to update card. Please try again.");
  }
};

const deleteCard = async (listId, cardId) => {
  const list = lists.value.find((l) => l.id === listId);
  if (!list) return;

  const cardIndex = list.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return;

  // Store card for rollback
  const removedCard = list.cards[cardIndex];

  // Remove from UI immediately
  list.cards.splice(cardIndex, 1);

  try {
    // Delete from database
    await apiDeleteTask(cardId);
    toast.success("Card deleted successfully!");
  } catch (error) {
    console.error("Failed to delete card:", error);

    // Rollback on error
    list.cards.splice(cardIndex, 0, removedCard);
    toast.error("Failed to delete card. Please try again.");
  }
};

const addTemplateCard = (listId) => {
  console.log("Adding template card to list:", listId);
};

// List management functions
const updateList = async (listId, updatedData) => {
  const listIndex = lists.value.findIndex((l) => l.id === listId);
  if (listIndex !== -1) {
    // Store previous state for rollback
    const previousList = { ...lists.value[listIndex] };

    // Apply optimistic update
    lists.value[listIndex] = { ...lists.value[listIndex], ...updatedData };

    // If cards were updated, save their positions to database
    if (updatedData.cards) {
      try {
        const cardPositions = updatedData.cards.map((card, index) => ({
          cardId: card.id,
          position: index + 1, // Position starts from 1
          listId: listId,
        }));

        await reorderTasks(cardPositions);
      } catch (error) {
        console.error("Failed to save card positions:", error);

        // Rollback on error
        lists.value[listIndex] = previousList;
        toast.error("Failed to save card positions. Please try again.");
      }
    }
  }
};
const deleteList = (listId, payload) => {
  const listIndex = lists.value.findIndex((l) => l.id === listId);
  if (listIndex === -1) return;

  // Store snapshot for possible restore
  if (payload?.snapshot) {
    deletedListSnapshots.value.set(listId, {
      snapshot: payload.snapshot,
      index: listIndex,
    });
  }

  // Remove immediately from UI
  lists.value.splice(listIndex, 1);
};

const restoreList = (listId) => {
  const entry = deletedListSnapshots.value.get(listId);
  if (!entry) return;
  const { snapshot, index } = entry;
  // Restore at original index
  lists.value.splice(index, 0, snapshot);
  deletedListSnapshots.value.delete(listId);
};

const handleSignOut = async () => {
  closeUserMenu();
  await signOut();
};

const openShareModal = () => {
  isShareModalOpen.value = true;
};

const closeShareModal = () => {
  isShareModalOpen.value = false;
};

// Watch for when form becomes visible to focus input
watch(showAddListForm, async (newVal) => {
  if (newVal) {
    await nextTick();
    listNameInput.value?.focus();
  }
});

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      isUserMenuOpen.value = false;
    }
  });
});

// Close dropdown on escape key
onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isUserMenuOpen.value) {
        closeUserMenu();
      }
    }
  });
});

onMounted(fetchBoard);
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

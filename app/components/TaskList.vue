<template>
  <div class="task-list" :style="{ backgroundColor: list.color }">
    <div class="list-header">
      <h3 class="list-title">{{ list.name }}</h3>
      <div class="list-actions">
        <button
          class="action-btn move-btn"
          title="Move list"
          @mousedown="onListDragStart"
        >
          <svg
            fill="none"
            viewBox="0 0 16 16"
            role="presentation"
            class="_1reo15vq _18m915vq _syaz1r31 _lcxvglyw _s7n4yfq0 _vc881r31 _1bsbpxbi _4t3ipxbi"
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
        </button>
        <button class="action-btn more-btn" title="More options">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <draggable
      v-model="localCards"
      group="cards"
      item-key="id"
      class="cards-container"
      :animation="200"
      ghost-class="card-ghost"
      chosen-class="card-chosen"
      drag-class="card-drag"
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

    <div class="add-card-section">
      <div v-if="!showAddCardForm" class="add-card-buttons">
        <div class="add-card-button" @click="showAddCardForm = true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="add-icon"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add a card
        </div>

        <!-- Template Card Button -->
        <button
          class="template-card-button"
          type="button"
          title="Create from template"
          @click="createFromTemplate"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="template-icon"
          >
            <path
              d="M3 6V5C3 3.89543 3.89543 3 5 3H6C6.55228 3 7 3.44772 7 4C7 4.55228 6.55228 5 6 5H5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 8C6 6.89543 6.89543 6 8 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H8C6.89543 20 6 19.1046 6 18V8ZM8 8H19V14H8V8ZM18 18C17.4477 18 17 17.5523 17 17C17 16.4477 17.4477 16 18 16C18.5523 16 19 16.4477 19 17C19 17.5523 18.5523 18 18 18ZM8 17C8 17.5523 8.44772 18 9 18H12C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16H9C8.44772 16 8 16.4477 8 17Z"
              fill="currentColor"
            />
            <path
              d="M4 14C3.44772 14 3 14.4477 3 15V16C3 17.1046 3.89543 18 5 18V15C5 14.4477 4.55228 14 4 14Z"
              fill="currentColor"
            />
            <path
              d="M3 9C3 8.44772 3.44772 8 4 8C4.55228 8 5 8.44772 5 9V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V9Z"
              fill="currentColor"
            />
            <path
              d="M8 4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H9C8.44772 5 8 4.55228 8 4Z"
              fill="currentColor"
            />
            <path
              d="M16 3C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H19C19 3.89543 18.1046 3 17 3H16Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div v-else class="add-card-form">
        <textarea
          v-model="newCardContent"
          placeholder="Enter a title for this card..."
          class="card-content-input"
          @keydown.ctrl.enter="createCard"
          @keydown.escape="cancelAddCard"
          ref="cardContentInput"
        ></textarea>
        <div class="form-actions">
          <button class="add-button" @click="createCard">Add Card</button>
          <button class="cancel-button" @click="cancelAddCard">Cancel</button>
        </div>
      </div>
    </div>

    <div class="list-footer"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";

const props = defineProps({
  list: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update-list",
  "delete-list",
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
  // Emit event to parent to handle list dragging
  emit("list-drag-start", props.list.id, event);
};

// Method to handle when this list is being dragged from parent draggable
const handleListDragStart = () => {
  // Add visual feedback for list dragging
  const listElement = event?.target?.closest(".task-list");
  if (listElement) {
    listElement.classList.add("list-being-dragged");
  }
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

const createCard = () => {
  if (newCardContent.value.trim()) {
    emit("add-card", props.list.id, newCardContent.value.trim());
    newCardContent.value = "";
    showAddCardForm.value = false;
  }
};

const createFromTemplate = () => {
  // Emit event to parent to handle template card creation
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
    cardContentInput.value?.focus();
  }
});
</script>

<style scoped>
.task-list {
  min-width: 280px;
  max-width: 280px;
  background: #4a5568;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: inherit;
  position: relative;
}

.list-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.list-actions {
  display: flex;
  gap: 4px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.task-list:hover .list-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  width: 28px;
  height: 28px;
}

.action-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.move-btn {
  cursor: grab;
}

.move-btn:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.cards-container {
  min-height: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 8px 12px;
  flex: 1;
}

.card-ghost {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px dashed rgba(255, 255, 255, 0.4) !important;
  transform: rotate(2deg) scale(0.98);
  transition: all 0.2s ease;
}

.card-chosen {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.card-drag {
  opacity: 0.9;
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  z-index: 1001;
}

.list-being-dragged {
  opacity: 0.8;
  z-index: 1001;
  transition: all 0.2s ease;
}

.add-card-section {
  padding: 8px 12px 8px 12px;
}

.add-card-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.add-card-button {
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  flex: 1;
  justify-content: flex-start;
}

.add-card-button:hover {
  color: white;
  transform: translateY(-1px);
}

.add-icon {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.template-card-button {
  color: rgba(255, 255, 255, 0.8);
  padding: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
}

.template-card-button:hover {
  color: white;
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.4);
}

.template-icon {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.add-card-form {
  background: var(--color-gray-800);
  padding: 12px;
  border-radius: 8px;
}

.card-content-input {
  width: 100%;
  color: white;
  min-height: 60px;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.card-content-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 8px;
}

.add-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.add-button {
  background: #667eea;
  color: white;
}

.add-button:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.cancel-button {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-button:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.list-footer {
  height: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .task-list {
    min-width: 260px;
    max-width: 260px;
  }

  .list-title {
    font-size: 15px;
  }

  .add-card-button {
    font-size: 13px;
  }
}
</style>

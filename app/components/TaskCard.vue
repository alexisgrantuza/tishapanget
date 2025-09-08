<template>
  <div
    class="task-card group bg-gray-800 rounded-lg p-3 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-white/20 hover:shadow-lg"
    :class="{ 'opacity-70': card.completed }"
  >
    <div class="card-content flex justify-between items-start gap-2">
      <div
        class="card-checkbox flex items-start gap-2 flex-1 cursor-pointer"
        @click="toggleComplete"
      >
        <!-- Checkbox  -->
        <div
          class="checkbox w-5 h-5 border-2 border-white/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100"
          :class="{
            'bg-green-500 border-green-500 opacity-100 mr-6': card.completed,
            'scale-0 group-hover:scale-100': !card.completed,
          }"
        >
          <svg
            v-if="card.completed"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="text-white"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        <!-- Card text that slides from left to right on hover -->
        <span
          class="card-text text-white text-sm leading-relaxed break-words flex-1 transition-all duration-300 ease-out transform -ml-6"
          :class="{
            'line-through text-white/60': card.completed,
            'translate-x-0': card.completed,
            'translate-x-0 group-hover:translate-x-6': !card.completed,
          }"
        >
          {{ card.content }}
        </span>
      </div>

      <!-- Action buttons - only visible on hover -->
      <div
        class="card-actions flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100"
      >
        <button
          class="edit-btn bg-transparent border-none text-white/60 hover:text-blue-400 hover:bg-blue-400/10 cursor-pointer p-1 rounded transition-all duration-200"
          @click="archiveCard"
          title="Archive card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-archive-icon lucide-archive"
          >
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
          </svg>
        </button>
        <button
          class="edit-btn bg-transparent border-none text-white/60 hover:text-blue-400 hover:bg-blue-400/10 cursor-pointer p-1 rounded transition-all duration-200"
          @click="startEdit"
          title="Edit card"
        >
          <svg
            fill="none"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            role="presentation"
            class="_1reo15vq _18m915vq _syaz1r31 _lcxvglyw _s7n4yfq0 _vc881r31 _1bsbpxbi _4t3ipxbi"
          >
            <path
              fill="currentcolor"
              d="M11.586.854a2 2 0 0 1 2.828 0l.732.732a2 2 0 0 1 0 2.828L10.01 9.551a2 2 0 0 1-.864.51l-3.189.91a.75.75 0 0 1-.927-.927l.91-3.189a2 2 0 0 1 .51-.864zm1.768 1.06a.5.5 0 0 0-.708 0l-.585.586L13.5 3.94l.586-.586a.5.5 0 0 0 0-.707zM12.439 5 11 3.56 7.51 7.052a.5.5 0 0 0-.128.217l-.54 1.89 1.89-.54a.5.5 0 0 0 .217-.127zM3 2.501a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-3H15v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3v1.5z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit form -->
    <div v-if="isEditing" class="edit-form mt-3 pt-3 border-t border-white/10">
      <textarea
        v-model="editContent"
        class="edit-input w-full min-h-[60px] p-2 border-2 border-gray-200 rounded text-sm resize-y mb-2 focus:border-purple-500 focus:outline-none bg-gray-800 text-white"
        @keydown.enter="saveEdit"
        @keydown.escape="cancelEdit"
        ref="editInput"
      ></textarea>
      <div class="edit-actions flex gap-2">
        <button
          class="save-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          @click="saveEdit"
        >
          Save
        </button>
        <button
          class="cancel-btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update", "delete", "archive"]);

const isEditing = ref(false);
const editContent = ref("");
const editInput = ref(null);

const toggleComplete = () => {
  emit("update", { completed: !props.card.completed });
};

const startEdit = () => {
  editContent.value = props.card.content;
  isEditing.value = true;
};

const saveEdit = () => {
  if (editContent.value.trim() && editContent.value !== props.card.content) {
    emit("update", { content: editContent.value.trim() });
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editContent.value = props.card.content;
};

const archiveCard = () => {
  if (confirm("Are you sure you want to archive this card?")) {
    emit("delete");
  }
};



// Watch for when edit mode becomes active to focus input
watch(isEditing, async (newVal) => {
  if (newVal) {
    await nextTick();
    editInput.value?.focus();
    editInput.value?.select();
  }
});
</script>

<style scoped>
.task-card {
  user-select: none;
  touch-action: none;
}

.checkbox:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.checkbox.bg-green-500:hover {
  background-color: rgb(34, 197, 94);
}

.task-card.sortable-ghost {
  opacity: 0.5;
  transform: rotate(5deg) scale(0.95);
  background: #4a5568 !important;
  border: 2px dashed rgba(255, 255, 255, 0.3) !important;
}

.task-card.sortable-chosen {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.task-card.sortable-drag {
  opacity: 0.8;
  transform: rotateZ(8deg) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 1001;
}

.task-card * {
  transition: all 0.2s ease;
}

.edit-input:focus,
.card-content:focus-within {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Custom animation for checkbox appearance */
@keyframes checkboxAppear {
  0% {
    opacity: 0;
    transform: translateX(-24px) scale(0) rotate(180deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-12px) scale(1.1) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotate(0deg);
  }
}

.group:hover .checkbox:not(.bg-green-500) {
  animation: checkboxAppear 0.3s ease-out;
}

.task-card.opacity-70 .checkbox {
  opacity: 1 !important;
  transform: translateX(0) scale(1) !important;
}

.card-text {
  transition: all 0.3s ease-out;
}
</style>

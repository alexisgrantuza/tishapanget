<template>
  <draggable v-model="myList" item-key="id">
    <template #item="{ element }">
      <div>{{ element.name }}</div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from "vuedraggable";
const myList = ref([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
]);
</script>

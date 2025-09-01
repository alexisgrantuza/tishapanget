// composables/useBoards.ts

export const useBoards = () => {
  const boards = ref([]);
  const loading = ref(false);

  const createBoard = async (boardData) => {
    loading.value = true;
    try {
      const newBoard = await $fetch("/api/boards", {
        method: "POST",
        body: boardData,
      });

      boards.value.push(newBoard);
      return newBoard;
    } catch (error) {
      console.error("Failed to create board:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchBoards = async (workspaceId) => {
    loading.value = true;
    try {
      const response = await $fetch(`/api/boards?workspaceId=${workspaceId}`);
      boards.value = response;
      return response;
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    boards: readonly(boards),
    loading: readonly(loading),
    createBoard,
    fetchBoards,
  };
};

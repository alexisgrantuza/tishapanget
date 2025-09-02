// composables/useBoards.ts
import type { Board, BoardData } from "~/types";

export const useBoards = () => {
  const boards = ref<Board[]>([]);
  const loading = ref(false);

  const createBoard = async (boardData: BoardData): Promise<Board> => {
    loading.value = true;
    try {
      const newBoard = await $fetch<Board>("/api/boards", {
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

  const fetchBoards = async (): Promise<Board[]> => {
    loading.value = true;
    try {
      const response = await $fetch<Board[]>("/api/boards");
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

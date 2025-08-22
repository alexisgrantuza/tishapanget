// composables/useBoards.ts

interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  lists?: any[];
}

export const useBoards = () => {
  const boards = ref<Board[]>([]);
  const currentBoard = ref<Board | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBoards = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch<{ data: Board[] }>("/api/boards");
      boards.value = data;

      // Set first board as current if none selected
      if (!currentBoard.value && data.length > 0) {
        currentBoard.value = data[0] || null;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to fetch boards";
      console.error("Error fetching boards:", err);
    } finally {
      loading.value = false;
    }
  };

  const createBoard = async (boardData: Partial<Board>) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch<{ data: Board }>("/api/boards", {
        method: "POST",
        body: boardData,
      });

      if (data) {
        boards.value.unshift(data);
        currentBoard.value = data;
        return data;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to create board";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch<{ data: Board }>(`/api/boards/${boardId}`, {
        method: "PATCH",
        body: updates,
      });

      if (data) {
        const index = boards.value.findIndex((board) => board.id === boardId);
        if (index !== -1) {
          boards.value[index] = data;
        }

        if (currentBoard.value?.id === boardId) {
          currentBoard.value = data;
        }

        return data;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to update board";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBoard = async (boardId: string) => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/boards/${boardId}`, {
        method: "DELETE" as any,
      });

      boards.value = boards.value.filter((board) => board.id !== boardId);

      if (currentBoard.value?.id === boardId) {
        currentBoard.value = boards.value[0] || null;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to delete board";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setCurrentBoard = (board: Board) => {
    currentBoard.value = board;
  };

  return {
    boards: readonly(boards),
    currentBoard: readonly(currentBoard),
    loading: readonly(loading),
    error: readonly(error),
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
  };
};

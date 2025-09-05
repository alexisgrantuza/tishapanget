// composables/useLists.ts
export const useLists = () => {
  const loading = ref(false);

  const deleteList = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      const response = await $fetch("/api/lists", {
        method: "DELETE",
        body: { listId },
      });

      if (response.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete list:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const archiveList = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement archive list API endpoint
      console.log("Archiving list:", listId);
      return true;
    } catch (error) {
      console.error("Failed to archive list:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const copyList = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement copy list API endpoint
      console.log("Copying list:", listId);
      return true;
    } catch (error) {
      console.error("Failed to copy list:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const moveAllCards = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement move all cards API endpoint
      console.log("Moving all cards from list:", listId);
      return true;
    } catch (error) {
      console.error("Failed to move all cards:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const archiveAllCards = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement archive all cards API endpoint
      console.log("Archiving all cards from list:", listId);
      return true;
    } catch (error) {
      console.error("Failed to archive all cards:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const sortCards = async (listId: string): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement sort cards API endpoint
      console.log("Sorting cards in list:", listId);
      return true;
    } catch (error) {
      console.error("Failed to sort cards:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const editListName = async (
    listId: string,
    newName: string
  ): Promise<boolean> => {
    loading.value = true;
    try {
      // TODO: Implement edit list name API endpoint
      console.log("Editing list name:", listId, newName);
      return true;
    } catch (error) {
      console.error("Failed to edit list name:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const reorderLists = async (
    listPositions: Array<{ listId: string; position: number }>
  ) => {
    loading.value = true;
    try {
      const res = await $fetch("/api/lists/reorder", {
        method: "POST",
        body: { listPositions },
      });
      return res;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    deleteList,
    archiveList,
    copyList,
    moveAllCards,
    archiveAllCards,
    sortCards,
    editListName,
    reorderLists,
  };
};

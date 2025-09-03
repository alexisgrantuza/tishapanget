export const useTasks = () => {
  const loading = ref(false);

  const createTask = async (listId: string, content: string) => {
    loading.value = true;
    try {
      const created = await $fetch("/api/tasks", {
        method: "POST",
        body: { listId, title: content },
      });
      return created as { id: string; title: string };
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (
    id: string,
    data: Partial<{ content: string; completed: boolean }>
  ) => {
    loading.value = true;
    try {
      const payload: Record<string, any> = {};
      if (typeof data.content === "string") payload.title = data.content;
      if (typeof data.completed === "boolean")
        payload.isArchived = data.completed;
      const updated = await $fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: payload,
      });
      return updated as { id: string };
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (id: string) => {
    loading.value = true;
    try {
      const res = await $fetch(`/api/tasks/${id}`, { method: "DELETE" });
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading: readonly(loading), createTask, updateTask, deleteTask };
};

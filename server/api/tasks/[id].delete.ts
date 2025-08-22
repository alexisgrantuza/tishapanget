import { prisma } from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    await prisma.task.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete task",
    });
  }
});

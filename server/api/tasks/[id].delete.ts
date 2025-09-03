import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Task id is required",
      });
    }

    // Validate access and existence through list->board
    const card = await prisma.card.findFirst({
      where: {
        id,
        list: {
          board: {
            OR: [
              { ownerId: user.id },
              { members: { some: { userId: user.id } } },
            ],
          },
        },
      },
      select: { id: true },
    });
    if (!card) {
      throw createError({ statusCode: 404, statusMessage: "Task not found" });
    }

    await prisma.card.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete task",
    });
  }
});

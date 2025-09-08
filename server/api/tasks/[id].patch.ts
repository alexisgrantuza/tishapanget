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

    const body = await readBody(event);
    const {
      title,
      description,
      priority,
      dueDate,
      isArchived,
      completed,
      listId,
      position,
    } = body || {};

    // Ensure the user has access to the card via its list->board
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

    const updated = await prisma.card.update({
      where: { id },
      data: {
        title: typeof title === "string" ? title : undefined,
        description: typeof description === "string" ? description : undefined,
        priority: priority ?? undefined,
        dueDate: dueDate
          ? new Date(dueDate)
          : dueDate === null
            ? null
            : undefined,
        isArchived: typeof isArchived === "boolean" ? isArchived : undefined,
        completed: typeof completed === "boolean" ? completed : undefined,
        listId: listId || undefined,
        position: typeof position === "number" ? position : undefined,
      },
    });

    return updated;
  } catch (error) {
    console.error("Error updating task:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update task",
    });
  }
});

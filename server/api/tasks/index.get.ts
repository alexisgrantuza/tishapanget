import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Optional query: listId to scope tasks to a list
export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const query = getQuery(event) as { listId?: string; boardId?: string };

    if (query.listId) {
      // Validate access through the list's board
      const list = await prisma.list.findFirst({
        where: {
          id: query.listId,
          status: "ACTIVE",
          board: {
            status: "ACTIVE",
            OR: [
              { ownerId: user.id },
              { members: { some: { userId: user.id } } },
            ],
          },
        },
        select: { id: true },
      });
      if (!list) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }

      const tasks = await prisma.card.findMany({
        where: { listId: query.listId, isArchived: false },
        orderBy: { position: "asc" },
      });
      return tasks;
    }

    if (query.boardId) {
      // Validate access to board
      const board = await prisma.board.findFirst({
        where: {
          id: query.boardId,
          status: "ACTIVE",
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
        select: { id: true },
      });
      if (!board) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }

      const tasks = await prisma.card.findMany({
        where: {
          list: { boardId: query.boardId, status: "ACTIVE" },
          isArchived: false,
        },
        orderBy: [{ listId: "asc" }, { position: "asc" }],
      });
      return tasks;
    }

    // Default: return nothing without a scope to avoid large queries
    return [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch tasks",
    });
  }
});

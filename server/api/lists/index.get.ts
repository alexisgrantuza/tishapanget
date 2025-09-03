import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const boardId = getQuery(event).boardId as string | undefined;
    if (!boardId) {
      throw createError({
        statusCode: 400,
        statusMessage: "boardId is required",
      });
    }

    // Ensure access to board
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        status: "ACTIVE",
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
      select: { id: true },
    });
    if (!board) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const lists = await prisma.list.findMany({
      where: { boardId, status: "ACTIVE" },
      include: {
        cards: {
          where: { isArchived: false },
          select: { id: true, title: true, isArchived: true },
        },
      },
      orderBy: { position: "asc" },
    });

    return lists;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch lists",
    });
  }
});

import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - User not authenticated",
      });
    }

    const body = await readBody(event);
    const { listId } = body;

    if (!listId) {
      throw createError({
        statusCode: 400,
        statusMessage: "listId is required",
      });
    }

    // First, get the list to check if user has access to the board
    const list = await prisma.list.findFirst({
      where: { id: listId },
      include: {
        board: {
          select: {
            id: true,
            ownerId: true,
            members: {
              where: { userId: user.id },
              select: { userId: true, role: true },
            },
          },
        },
      },
    });

    if (!list) {
      throw createError({
        statusCode: 404,
        statusMessage: "List not found",
      });
    }

    // Check if user has access to the board (owner or member)
    const hasAccess =
      list.board.ownerId === user.id ||
      list.board.members.some((member) => member.userId === user.id);

    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden - You don't have access to this board",
      });
    }

    // Delete the list (this will cascade delete all cards due to Prisma schema)
    await prisma.list.delete({
      where: { id: listId },
    });

    return { success: true, message: "List deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting list:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete list",
    });
  }
});

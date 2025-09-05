import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const body = await readBody(event);
    const { listPositions } = body || {};

    if (!listPositions || !Array.isArray(listPositions)) {
      throw createError({
        statusCode: 400,
        statusMessage: "listPositions array is required",
      });
    }

    // Validate that user has access to all lists
    for (const listUpdate of listPositions) {
      const { listId, position } = listUpdate;

      if (!listId || typeof position !== "number") {
        throw createError({
          statusCode: 400,
          statusMessage: "Each list must have listId and position",
        });
      }

      // Check access to the list via its board
      const list = await prisma.list.findFirst({
        where: {
          id: listId,
          status: "ACTIVE",
          board: {
            OR: [
              { ownerId: user.id },
              { members: { some: { userId: user.id } } },
            ],
          },
        },
        select: { id: true },
      });

      if (!list) {
        throw createError({
          statusCode: 403,
          statusMessage: `Access denied to list ${listId}`,
        });
      }
    }

    // Update all list positions in a transaction
    const updatePromises = listPositions.map(({ listId, position }) =>
      prisma.list.update({
        where: { id: listId },
        data: { position },
      })
    );

    await Promise.all(updatePromises);

    return { success: true, updated: listPositions.length };
  } catch (error) {
    console.error("Error reordering lists:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reorder lists",
    });
  }
});

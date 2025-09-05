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
    const { cardPositions } = body || {};

    if (!cardPositions || !Array.isArray(cardPositions)) {
      throw createError({
        statusCode: 400,
        statusMessage: "cardPositions array is required",
      });
    }

    // Validate that user has access to all cards
    for (const cardUpdate of cardPositions) {
      const { cardId, position, listId } = cardUpdate;

      if (!cardId || typeof position !== "number") {
        throw createError({
          statusCode: 400,
          statusMessage: "Each card must have cardId and position",
        });
      }

      // Check access to the card via its list->board
      const card = await prisma.card.findFirst({
        where: {
          id: cardId,
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
        throw createError({
          statusCode: 403,
          statusMessage: `Access denied to card ${cardId}`,
        });
      }
    }

    // Update all card positions in a transaction
    const updatePromises = cardPositions.map(({ cardId, position, listId }) =>
      prisma.card.update({
        where: { id: cardId },
        data: {
          position,
          ...(listId && { listId }), // Update listId if provided (for cross-list moves)
        },
      })
    );

    await Promise.all(updatePromises);

    return { success: true, updated: cardPositions.length };
  } catch (error) {
    console.error("Error reordering tasks:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reorder tasks",
    });
  }
});

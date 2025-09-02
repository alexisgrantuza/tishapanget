import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - User not authenticated",
      });
    }

    // Get boards where user is owner or member
    const boards = await prisma.board.findMany({
      where: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
        status: "ACTIVE",
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        lists: {
          where: { status: "ACTIVE" },
          include: {
            cards: {
              where: { isArchived: false },
              select: { id: true },
            },
          },
          orderBy: { position: "asc" },
        },
        _count: {
          select: {
            lists: true,
            members: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return boards;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch boards",
    });
  }
});
